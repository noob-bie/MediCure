<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log facade

class OrderService {
    public function placeOrder($user, $selectedOrderItems) {
        Log::info('OrderService: placeOrder - Selected Order Items: ' . json_encode($selectedOrderItems)); // Log selectedOrderItems
        return DB::transaction(function () use ($user, $selectedOrderItems) {
            // ... rest of your OrderService::placeOrder function ...
        });
    }

    public function getUserOrders($user) {
        return Order::where('user_id', $user->id)->with('items.product')->get();
    }
}
