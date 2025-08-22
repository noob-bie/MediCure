<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;

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

// Authentication routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// Health check route
Route::get('/health-check', function () {
    return response()->json(['message' => 'Backend is running!']);
});

// Protected routes (require authentication)
Route::middleware(['jwt.auth'])->group(function () {
    // User profile
    Route::get('/profile', [ProfileController::class, 'getUserProfile']);

    // Cart management
    Route::get('/cart', [CartController::class, 'index']); // View current user's cart
    Route::post('/cart/items', [CartController::class, 'addItem']); // Add item to cart
    Route::put('/cart/items/{cart_item_id}', [CartController::class, 'updateItem']); // Update item quantity
    Route::delete('/cart/items/{cart_item_id}', [CartController::class, 'removeItem']); // Remove item from cart

    // Order management
    Route::post('/orders', [OrderController::class, 'placeOrder']); // Place an order
    Route::get('/orders', [OrderController::class, 'getOrders']); // Get user orders
    Route:: get('/orders/pending', [OrderController::class, 'pendingPayments']);
    // Payment processing
    Route::post('/cart/remove-items', [CartController::class, 'removeItems']);
    Route::post('/confirm-order', [PaymentController::class, 'confirmOrder']); // Confirm order payment
});
//Route::middleware('auth:sanctum')->get('/orders/pending', [OrderController::class, 'pendingPayments']);

// Admin routes (consider adding admin middleware later)
Route::post('/admin/products', [ProductController::class, 'store']); // Admin adds product

// Public product routes
Route::get('/products', [ProductController::class, 'index']); // List all products
Route::get('/products/{id}', [ProductController::class, 'show']); // Single product detail
