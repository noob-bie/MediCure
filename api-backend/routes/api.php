
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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReviewController;

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
// Public product routes
Route::get('/products', [ProductController::class, 'index']); // List all products with category filtering
Route::get('/products/{id}', [ProductController::class, 'show']); // Single product detail
Route::get('/categories', [ProductController::class, 'getCategories']); // Get available categories

Route::get('/products/search', [ProductController::class, 'search']); // Search products by name

// Protected routes (require authentication)
Route::middleware(['jwt.auth'])->group(function () {
    // User profile
    Route::get('/profile', [ProfileController::class, 'getUserProfile']);
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);

    // Cart management
    Route::get('/cart', [CartController::class, 'index']); // View current user's cart
    Route::post('/cart/items', [CartController::class, 'addItem']); // Add item to cart
    Route::put('/cart/items/{cart_item_id}', [CartController::class, 'updateItem']); // Update item quantity
    Route::delete('/cart/items/{cart_item_id}', [CartController::class, 'removeItem']); // Remove item from cart

    // Order management
    Route::post('/orders', [OrderController::class, 'placeOrder']); // Place an order
    Route::get('/orders', [OrderController::class, 'getOrders']); // Get user orders
    Route::get('/orders/pending', [OrderController::class, 'pendingPayments']);
    Route::put('/orders/{orderId}/cancel', [OrderController::class, 'cancelOrder']); // Cancel order

    // Payment processing
    //Route::post('/cart/remove-items', [CartController::class, 'removeItems']);
    Route::post('/cart/remove-selected', [CartController::class, 'removeSelectedItems']);

    Route::post('/confirm-order', [PaymentController::class, 'confirmOrder']); // Confirm order payment

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});
//Route::middleware('auth:sanctum')->get('/orders/pending', [OrderController::class, 'pendingPayments']);

// Admin routes (require admin authentication)
Route::middleware(['jwt.auth'])->group(function () {
    // Product management (Admin only - validation happens in controller)
    Route::get('/admin/dashboard-stats', [DashboardController::class, 'getDashboardStats']); // Get dashboard statistics
    Route::post('/admin/products', [ProductController::class, 'store']); // Admin adds product
    Route::put('/admin/products/{id}', [ProductController::class, 'update']); // Admin updates product
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']); // Admin deletes product
    Route::get('/admin/orders', [AdminOrderController::class, 'index']); // Get all orders
    Route::get('/admin/deliverymen', [AdminOrderController::class, 'getDeliverymen']); // Get delivery men
    Route::put('/admin/orders/{orderId}/assign', [AdminOrderController::class, 'assignDeliveryman']); // Assign deliveryman
    Route::put('/admin/orders/{orderId}/status', [AdminOrderController::class, 'updateStatus']); // Update order status

    // Delivery Management
    Route::get('/delivery/my-orders', [DeliveryController::class, 'getMyOrders']); // Get assigned orders
    Route::get('/delivery/history', [DeliveryController::class, 'getDeliveryHistory']); // Get delivery history
    Route::put('/delivery/orders/{orderId}/status', [DeliveryController::class, 'updateOrderStatus']); // Update order status
    Route::get('/delivery/dashboard-counts', [DeliveryController::class, 'getDashboardCounts']); // Get dashboard counts
});
