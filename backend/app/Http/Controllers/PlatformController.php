<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PlatformController extends Controller
{
    public function index()
    {
        $platforms = Platform::all()->map->only("id", "name", "url");
        return response()->json($platforms);
    }

    public function store(Request $request){
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "url" => "nullable|string",
        ]);

        $platform = Platform::create($validated);

        if($platform)
            return response()->json($platform, 201);
        else
            return response()->json(['error' => 'Error creating platform'], 500);
    }
}
