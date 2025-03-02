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
Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
});
// Route::middleware(['auth:api', 'admin'])->group(function () { // Apply auth and admin middleware to this group
//     Route::post('/admin/products', [ProductController::class, 'store']); // Admin adds product
// });
Route::post('/admin/products', [ProductController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']); // List all products (public)
Route::get('/products/{id}', [ProductController::class, 'show']); // Single product detail (public)
