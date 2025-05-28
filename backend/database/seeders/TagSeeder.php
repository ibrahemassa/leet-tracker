<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $tags = [
        "Array",
        "String",
        "Hash Table",
        "Dynamic Programming",
        "Stack",
        "Queue",
        "Linked List",
        "Binary Search",
        "Tree",
        "Graph",
        "Heap (Priority Queue)",
        "Backtracking",
        "Breadth-First Search",
        "Depth-First Search",
        "Greedy"
    ];

        foreach ($tags as $tag) {
            Tag::create([
                "name" => $tag,
            ]);
        }
    }
}
