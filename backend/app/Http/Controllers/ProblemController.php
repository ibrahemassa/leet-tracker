<?php

namespace App\Http\Controllers;

use App\Enums\Difficulty;
use App\Enums\Status;
use App\Models\Problem;
use App\Models\Solution;
use App\Models\Tag;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use App\Http\Controllers\ApiGateway;
use App\Models\Platform;

class ProblemController extends Controller
{

    public function index(Request $request)
    {
        try {
            $local_problems = $this->problems_query($request);
            $service_problems = $this->get_service_problems_with_query($request);
            $merged_problems = collect($local_problems)->merge($service_problems)->unique("url")->values();

            return response()->json($merged_problems);
        } catch (\Throwable $th) {
            // return response()->json($th->getMessage());
            return response()->json($local_problems);
        }
    }

    public function store(Request $request)
    {
        // $user = $request->user();
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "url" => "required|string|unique:problems",
            "platform_id" => "required|exists:platforms,id",
            "difficulty" => ["required", Rule::in(Difficulty::cases())],
            "tags" => "nullable|array",
            "tags.*" => "exists:tags,id",
        ]);

        $validated['difficulty'] = Difficulty::from(strtolower($validated['difficulty']));
        $validated["id"] = Problem::max('id') > 4000 ? Problem::max('id') + 1 : 4001;

        try {
            $problem = Problem::create($validated);

            if (isset($validated["tags"])) {
                $problem->tags()->attach($validated['tags']);
            }

            $this->send_problem($problem->id);

            return response()->json($problem, 201);
        } catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $problem = Problem::findOrFail($id);

            $problem["platform"] = $problem->platform ? $problem->platform->name : "No platform";

            $problem = $problem->only([
                "id",
                "name",
                "url",
                "difficulty",
                "platform",
            ]);


            return response()->json($problem, 200);
        } catch (Exception $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $updated = false;
        $validated = $request->validate([
            "name" => "nullable|string|max:255",
            "url" => "nullable|string",
            "platform_id" => "nullable|exists:platforms,id",
            "difficulty" => ["nullable", Rule::in(Difficulty::cases())],
            "tags" => "nullable|array",
            "tags.*" => "nullable|exists:tags,id",
        ]);

        if (isset($validated['difficulty'])) {
            $validated['difficulty'] = Difficulty::from($validated['difficulty']);
        }

        $cleanTags = [];
        if (isset($validated["tags"]) && count($validated["tags"]) > 0) {
            $cleanTags = array_filter($validated["tags"], fn($tag) => !empty($tag));
        }

        try {
            $problem = Problem::findOrFail($id);

            $problem->update(array_filter($validated, function ($field) {
                return !is_null($field) && !is_array($field);
            }));

            if (count($cleanTags) > 0) {
                $problem->tags()->sync($cleanTags);
            }
            $updated  = true;
        } catch (\Throwable $th) {
        }

        try {
            $tagObjects = [];
            if (!empty($cleanTags)) {
                $tags = Tag::whereIn('id', $cleanTags)->get(['id', 'name']);
                $tagObjects = $tags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name
                ])->toArray();
            }
            $request_data = [
                'id' => (int) $id,
                'name' => $validated['name'] ?? null,
                'url' => $validated['url'] ?? null,
                'difficulty' => $validated['difficulty'] ?? null,
                'platform' => $validated['platform_id'] ?? 1,
                "tags" => $tagObjects ?? null,
            ];

            $request = Request::create("", "PUT", $request_data);
            $gateway = new ApiGateway();
            $response = $gateway->problem_service($request, "/problems");
            $updated = true;
            return response()->json(json_decode($response->getContent()), $response->getStatusCode());
        } catch (\Throwable $th) {
            if (!$updated)
                return response()->json(["Error" => $th->getMessage()], 404);
        }
        return response()->json(["Successful" => "Problem updated!"], 200);
    }

    public function destroy($id)
    {
        $deleted = false;
        try {
            $problem = Problem::findOrFail($id);
            $problem->delete();
            $deleted = true;
        } catch (\Throwable $th) {
        }

        try {
            $request = Request::create("", "DELETE");
            $gateway = new ApiGateway();
            $gateway->problem_service($request, "/problems/" . (string) $id);
            $deleted = true;
        } catch (\Throwable $th) {
            if (!$deleted) {
                return response()->json(["Error" => $th->getMessage()], 404);
            }
        }
        return response()->json(["Successful" => "Problem deleted!"], 200);
    }

    private function problems_query(Request $request)
    {
        $query = Problem::query();

        foreach ($request->all() as $key => $value) {
            if (empty($value) || $value === '*') continue;

            if ($key === 'tags' && is_array($value)) {
                $tagIds = array_filter($value);
                if (!empty($tagIds)) {
                    $query->whereHas('tags', function ($q) use ($tagIds) {
                        $q->whereIn('tags.id', $tagIds);
                    });
                }
            } else if ($key == "difficulty") {
                $query->where("difficulty", Difficulty::from(strtolower($value)));
            } else if ($key == "status") {
                $user = $request->user();
                if (!$user) continue;

                try {
                    if (strtolower($value) === 'unsolved') {
                        $query->whereDoesntHave('solutions', function ($q) use ($user) {
                            $q->where('user_id', $user->id);
                        });
                    } else {
                        $query->whereHas('solutions', function ($q) use ($user, $value) {
                            $q->where('user_id', $user->id)
                                ->where('status', Status::from(strtolower($value)));
                        });
                    }
                } catch (\Throwable $th) {
                    continue;
                }
            } else if (Schema::hasColumn('problems', $key)) {
                $query->where($key, $value);
            }
        }

        $results = $query->get();
        return $results->isNotEmpty() ? $this->map_problems($results) : [];
    }

    private function get_service_problems_with_query(Request $request)
    {
        $service_problems = $this->fetch_problems_from_service();
        $service_problems = $this->map_service_problems($service_problems);
        $service_problems = $this->filter_service_problems($service_problems, $request->all());
        return $service_problems;
    }

    private function map_problems($problems)
    {
        return $problems->map(function ($problem) {
            return [
                "id" => $problem->id,
                "name" => $problem->name,
                "url" => $problem->url,
                "difficulty" => $problem->difficulty,
                "platform" => $problem->platform ? $problem->platform->name : "No platform",
                "tags" => $problem->tags->map(fn($tag) => [
                    'id' => $tag->pivot->tag_id,
                    'name' => $tag->name,
                ])->values(),
            ];
        });
    }

    private function map_service_problems($problems)
    {
        $tags = Tag::all();
        $platforms = Platform::all();

        return $problems->map(function ($problem) use ($tags, $platforms) {

            $problem_tags = [];
            foreach ($problem->tags as $k => $v) {
                $found = $tags->firstWhere("id", $v->id);
                if ($found)
                    $problem_tags[] = [
                        "id" => $found->id,
                        "name" => $found->name
                    ];
            }
            $problem_platform = $platforms->firstWhere("id", $problem->platform)->name ?? "No platform";

            return [
                "id" => $problem->id,
                "name" => $problem->name,
                "url" => $problem->url,
                "difficulty" => Difficulty::from(strtolower($problem->difficulty)),
                "platform" => $problem_platform,
                "tags" => $problem_tags,
            ];
        });
    }

    public function problems_count()
    {
        return response()->json(["Count" => Problem::count()], 200);
    }

    private function send_problem($id)
    {
        try {
            $problem = Problem::findOrFail($id);

            $tags = $problem->tags->map(function ($tag) {
                return [
                    "id" => (string) $tag->pivot->tag_id,
                    "name" => $tag->name,
                ];
            });

            $request_data = [
                'id' => $problem->id,
                'name' => $problem->name,
                'url' => $problem->url,
                'difficulty' => $problem->difficulty,
                'platform' => $problem->platform_id,
                "tags" => $tags,
            ];

            $request = Request::create("", "POST", $request_data);
            $gateway = new ApiGateway();
            $gateway->problem_service($request, "/problems");

            return response()->json("Good", 200);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 500);
        }
    }

    private function fetch_problems_from_service()
    {
        $request = Request::create("", "GET");
        $gateway = new ApiGateway();
        $response = $gateway->problem_service($request, "/problems");

        $problems = collect(json_decode($response->original[0]));
        return $problems;
    }

    private function filter_service_problems($problems, $filters)
    {
        return $problems->filter(function ($problem) use ($filters) {
            foreach ($filters as $key => $value) {
                if (empty($value) || $value === '*') continue;

                if ($key === 'tags' && is_array($value)) {
                    if (!isset($problem['tags']))
                        return false;
                    $tagIds = array_filter($value);
                    $problem_tag_ids = collect($problem['tags'])->pluck('id')->all();
                    if (empty(array_intersect($tagIds, $problem_tag_ids))) {
                        return false;
                    }
                } else if ($key == "status" && strtolower($value) === 'unsolved') {
                    if (Problem::where('url', $problem['url'])->exists()) {
                        return false;
                    }
                } else if ($key == "difficulty") {
                    if (!isset($problem['difficulty']) || strtolower($problem['difficulty']->value) !== strtolower($value)) {
                        return false;
                    }
                } else if (!isset($problem[$key]) || $problem[$key] != $value) {
                    return false;
                }
            }
            return true;
        })->values();
    }
}
