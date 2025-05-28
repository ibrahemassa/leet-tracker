<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Http\Middleware\IbrahemsAuthService;

//apiResource methods request types
//index: get
//store: post
//show: get
//update: put
//destroy: delete

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(IbrahemsAuthService::class);


Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout'])->middleware(IbrahemsAuthService::class);
Route::put('/user', [UserController::class, 'update'])->middleware(IbrahemsAuthService::class);

Route::get('/userstats', [UserController::class, "fetch_stats"])->middleware(IbrahemsAuthService::class);

Route::apiResource("platforms", PlatformController::class)->only(["index", "store"]);

Route::get("/prop/test", [ProblemController::class, "fetch_problems_from_service"]);
Route::get("/problems/count", [ProblemController::class, "problems_count"]);
Route::apiResource("problems", ProblemController::class)->middleware(IbrahemsAuthService::class);

Route::apiResource("solutions", SolutionController::class)->middleware(IbrahemsAuthService::class);
Route::apiResource("tags", TagController::class);



