<?php

namespace Database\old;

use App\Models\Problem;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class oldProblemSeeder extends Seeder
{
    public function run(): void
    {
        $api_url = "https://alfa-leetcode-api.onrender.com/problems?limit=100";
        $problems_url = "https://leetcode.com/problems/";
        $response = Http::get($api_url);
        $data = json_decode($response);

        foreach ($data->problemsetQuestionList as $id => $problem) {
            $newProblem = Problem::create([
                "name" => $problem->title,
                "url" => $problems_url . $problem->titleSlug,
                "difficulty" => strtolower($problem->difficulty),
                "platform_id" => 1,
            ]);

            $tagIds = [];
            $tags = $problem->topicTags ?? [];

            foreach ($tags as $tag) {
                $tag = Tag::where('name', $tag->name)->first();
                if ($tag) {
                    $tagIds[] = $tag->id;
                }
            }
            $newProblem->tags()->attach($tagIds);
        }
    }
}
