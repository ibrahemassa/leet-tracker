<?php

namespace App\Utils;

use App\Enums\Difficulty;
use App\Http\Controllers\ApiGateway;
use App\Models\Problem;
use App\Models\Tag;
use Illuminate\Http\Request;

class ProblemUtils
{
    public function store_problem_from_service($problem_array): Problem
    {
        $problem = Problem::create([
            'id' => $problem_array['id'],
            'name' => $problem_array['name'],
            'url' => $problem_array['url'],
            'difficulty' => Difficulty::from(strtolower($problem_array['difficulty'])),
            'platform_id' => $problem_array['platform'],
        ]);


        if (!empty($problem_array['tags'])) {
            $tagIds = [];
            foreach ($problem_array['tags'] as $tag) {
                $tagModel = Tag::find($tag["id"]);
                if ($tagModel)
                    $tagIds[] = $tagModel->id;
            }
            $problem->tags()->attach($tagIds);
        }

        return $problem;
    }

    public function fetch_problems_from_service_id($id)
    {
        $request = Request::create("", "GET");
        $gateway = new ApiGateway();
        $response = $gateway->problem_service($request, "/problems/" . (string) $id);

        return json_decode($response->original[0], true);
    }
}
