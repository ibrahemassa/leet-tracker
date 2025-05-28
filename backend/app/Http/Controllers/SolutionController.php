<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Enums\Language;
use App\Models\Solution;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use App\Http\Controllers\ApiGateway;
use App\Models\Problem;
use App\Utils\ProblemUtils;



class SolutionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Solution::with("problem")->where("user_id", $user->id);
        foreach ($request->all() as $key => $value) {
            if (empty($value) || $value === '*') continue;

            if (Schema::hasColumn('solutions', $key)) {
                $query->where($key, $value);
            } else if (Schema::hasColumn('problems', $key)) {
                $query->whereHas("problem", function ($q) use ($key, $value) {
                    $q->where($key, $value);
                });
            }
        }
        $solutions = $query->get();

        return response()->json($solutions, 200);
    }

    public function store(Request $request, ProblemUtils $problem_utils)
    {
        $user = $request->user()->id;
        $problem = Problem::find($request->problem_id);
        if (!$problem) {
            $service_problem = $problem_utils->fetch_problems_from_service_id($request->problem_id);
            if (!$service_problem) {
                return response()->json(['error' => 'Problem not found in service'], 404);
            }
            $problem = $problem_utils->store_problem_from_service($service_problem);
        }

        $validated = $request->validate([
            "problem_id" => "required|integer",
            "status" => ["required", Rule::in(Status::cases())],
            "language" => ["required", Rule::in(Language::cases())],
            "code" => "string",
            "sol_url" => "string|unique:solutions",
        ]);

        $validated["user_id"] = $user;
        $validated["status"] = Status::fromInsensitive($validated["status"]);
        $validated["language"] = Language::fromInsensitive($validated["language"]);
        try {
            $solution = Solution::create($validated);
            if($solution->status->value === "solved"){
                $this->send_submission($solution->id);
            }
            return response()->json($solution, 201);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 400);
        }
    }

    public function show(Request $request, string $id)
    {
        try {
            $solution = Solution::findOrFail($id);
            if ($request->user()->id != $solution->user_id)
                throw new Exception("user_id missmatch", 400);
            return response()->json($solution, 200);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $solution = Solution::findOrFail($id);
            $old_status = $solution->status->value;

            if ($request->user()->id != $solution->user_id)
                throw new Exception("user_id missmatch", 400);
            $validated = $request->validate([
                "problem_id" => "exists:problems,id",
                "status" => ["nullable", Rule::in(Status::cases())],
                "language" => ["nullable", Rule::in(Language::cases())],
                "code" => "nullable|string",
                "sol_url" => "nullable|string",
            ]);

            $solved_new = false;
            $unsolved_new = false;

            if (isset($validated['status'])) {
                $validated['status'] = Status::from($validated['status']);

                if ($validated['status']->value === 'solved' && $old_status !== 'solved') {
                    $solved_new = true;
                } elseif ($validated['status']->value !== 'solved' && $old_status === 'solved') {
                    $unsolved_new = true;
                }
            }

            $solution->update($validated);
            if($solved_new){
                $this->send_submission($solution->id);
            } else if($unsolved_new){
                $this->delete_submission($solution->id);
            }

            return response()->json(["Solution updated successfully", $solution], 200);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }

    public function destroy(Request $request, string $id)
    {
        try {
            $solution = Solution::findOrFail($id);
            if ($request->user()->id != $solution->user_id)
                throw new Exception("user_id missmatch", 400);
            if($solution->status->value === "solved"){
                $this->delete_submission($solution->id);
            }
            $solution->delete();
            return response()->json(["Successful" => "Solution Deleted!"], 200);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }
    public function solution_query(Request $request)
    {
        $user = $request->user();
        $query = Solution::query();
        $query->where("user_id", $user->id);
        foreach ($request->all() as $key => $value) {
            if (empty($value) || $value === '*') continue;

            if ($key === 'tags' && is_array($value)) {
                $tagIds = array_filter($value);
                $query->problem->whereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('tags.id', $tagIds);
                });
            } else if (Schema::hasColumn('solutions', $key)) {
                $query->where($key, $value);
            }
        }
        $solutions = $query->get();
        $solutions->map->problem;

        return response()->json($solutions, 200);
    }

    private function get_submission_data($id)
    {
        $solution = Solution::with('problem')->findOrFail($id);
        $problem = $solution->problem;
        $tags = $problem->tags->map(function ($tag) {
            return $tag->pivot->tag_id;
        });
        $user_id = (string) $solution->user_id;

        $requestData = [["difficulty" => $problem->difficulty, "tags" => $tags], $user_id];
        return $requestData;
    }

    private function send_submission($id)
    {
        try {
            $requestData = $this->get_submission_data($id);
            $apiGateway = new ApiGateway();
            $apiRequset = Request::create("", "POST", $requestData[0]);
            $apiGateway->stat_service($apiRequset, "/submission/" . $requestData[1]);
            return response()->json("good");
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }

    private function delete_submission($id)
    {
        try {
            $requestData = $this->get_submission_data($id);
            $apiGateway = new ApiGateway();
            $apiRequset = Request::create("", "DELETE", $requestData[0]);
            $apiGateway->stat_service($apiRequset, "/submission/" . $requestData[1]);
            return response()->json("good");
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 404);
        }
    }
}
