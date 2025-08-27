<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService {
    public function placeOrder($user, $selectedOrderItems, $paymentMethod = null) {
        Log::info('OrderService: placeOrder - Selected Order Items: ' . json_encode($selectedOrderItems));

        return DB::transaction(function () use ($user, $selectedOrderItems, $paymentMethod) {

            // ✅ Always create orders as 'pending' initially
            $order = new Order();
            $order->user_id = $user->id;
            $order->total_price = 0;
            $order->status = 'pending'; // ✅ Consistent initial status
            $order->save();

            $total = 0;

            // Add order items
            foreach ($selectedOrderItems as $item) {
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->product_id = $item['product_id'];
                $orderItem->quantity = $item['quantity'];
                $orderItem->price = $item['price'];
                $orderItem->save();

                $total += $item['price'] * $item['quantity'];
            }

            // Update total price
            $order->total_price = $total;
            $order->save();

            // ✅ Don't create payment here - let PaymentController handle it
            // This ensures both single product and cart checkout follow the same flow

            return $order;
        });
    }

    public function getUserOrders($user) {
        return Order::where('user_id', $user->id)->with('items.product')->get();
    }
}
