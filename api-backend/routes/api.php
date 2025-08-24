<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\DeliveryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Unified API routes including user, admin, and delivery functionalities.
|
*/

// Authentication
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// Health check
Route::get('/health-check', function () {
    return response()->json(['message' => 'Backend is running!']);
});

// Public product routes
Route::get('/products', [ProductController::class, 'index']); // List all products
Route::get('/products/{id}', [ProductController::class, 'show']); // Single product
Route::get('/categories', [ProductController::class, 'getCategories']); // Product categories

// Protected routes (require authentication)
Route::middleware(['jwt.auth'])->group(function () {

    // User profile
    Route::get('/profile', [ProfileController::class, 'getUserProfile']);

    // Cart management
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{cart_item_id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{cart_item_id}', [CartController::class, 'removeItem']);
    Route::post('/cart/remove-selected', [CartController::class, 'removeSelectedItems']);

    // Order management
    Route::post('/orders', [OrderController::class, 'placeOrder']);
    Route::get('/orders', [OrderController::class, 'getOrders']);
    Route::get('/orders/pending', [OrderController::class, 'pendingPayments']);

    // Payment
    Route::post('/confirm-order', [PaymentController::class, 'confirmOrder']);

    // Admin routes
    Route::middleware(['admin'])->group(function () {
        // Product management
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);

        // Admin order management
        Route::get('/admin/orders', [AdminOrderController::class, 'index']);
        Route::get('/admin/deliverymen', [AdminOrderController::class, 'getDeliverymen']);
        Route::put('/admin/orders/{orderId}/assign', [AdminOrderController::class, 'assignDeliveryman']);
        Route::put('/admin/orders/{orderId}/status', [AdminOrderController::class, 'updateStatus']);
    });

    // Delivery routes
    Route::middleware(['deliveryman'])->group(function () {
        Route::get('/delivery/my-orders', [DeliveryController::class, 'getMyOrders']);
        Route::get('/delivery/history', [DeliveryController::class, 'getDeliveryHistory']);
        Route::put('/delivery/orders/{orderId}/status', [DeliveryController::class, 'updateOrderStatus']);
    });
});
