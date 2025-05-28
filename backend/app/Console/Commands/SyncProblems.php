<?php

namespace App\Console\Commands;

use App\Enums\Difficulty;
use App\Models\Problem;
use App\Models\Platform;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;


class SyncProblems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-problems';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    public function handle()
    {
        $response = Http::get('127.0.0.1:9000/problems');

        foreach ($response->json() as $problemData) {
            $problem = Problem::updateOrCreate(
                ['id' => $problemData['id']],
                [
                    'name' => $problemData['name'],
                    'url' => $problemData['url'],
                    'difficulty' => Difficulty::from(strtolower($problemData['difficulty'])),
                    'platform_id' => Platform::firstOrCreate(['id' => $problemData['platform_id']])->id,
                ]
            );

            $tags = $problemData['tags'];
            $tagIds = [];

            foreach ($tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }

            $problem->tags()->sync($tagIds);
        }

        $this->info("Problems synced successfully.");
    }
}
