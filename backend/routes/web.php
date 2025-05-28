<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(["Hello" => "world"]);
});


// Platforms -> get/post
// Problems -> get/post
// user-problems -> get/post
// progress -> get
