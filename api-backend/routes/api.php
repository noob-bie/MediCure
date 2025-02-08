<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Route::get('/test', [TestController::class, 'getTestHuman'])->middleware('test.middleware');
//Route::get('/test/{id}', [TestController::class, 'getTestHumanWithId']);
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::get('/health-check', function () {
        return response()->json(['message' => 'Backend is running!']);
    });




