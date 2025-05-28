<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        return Tag::all()->map(function($tag){
            return [
                "id" => $tag->id,
                "name" => $tag->name
            ];
        });
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "name" => "required|string|unique:tags"
            ]);

            $tag = Tag::create($validated);
            return response()->json($tag, 200);
        } catch (\Throwable $th) {
            return response()->json(["Error" => $th->getMessage()], 400);
        }
    }
}
