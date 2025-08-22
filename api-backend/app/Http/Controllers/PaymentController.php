<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Cart;       // ✅ add
use App\Models\CartItem;   // ✅ add
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function confirmOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'selected_cart_item_ids' => 'array', // ✅ Accept selected cart item IDs
            'selected_cart_item_ids.*' => 'integer|exists:cart_items,id'
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {
            // Find the order for the logged-in user
            $order = Order::where('id', $request->order_id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            // Create payment record
            $payment = Payment::create([
                'order_id'       => $order->id,
                'payment_method' => 'cash_on_delivery',
                'payment_status' => 'yet_to_pay',
            ]);

            // ✅ Update order status to enum-safe value
            $order->update(['status' => 'confirmed']);

            // ✅ Handle cart cleanup based on selected items
            $selectedCartItemIds = $request->input('selected_cart_item_ids', []);

            if (!empty($selectedCartItemIds)) {
                Log::info('PaymentController: Removing selected cart items: ' . json_encode($selectedCartItemIds));

                // Remove only the selected cart items that belong to this user
                CartItem::whereIn('id', $selectedCartItemIds)
                    ->whereHas('cart', function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->delete();

                // Check if cart is now empty, if so, delete the cart itself
                $cart = Cart::where('user_id', $user->id)->first();
                if ($cart && $cart->cartItems()->count() === 0) {
                    Log::info('PaymentController: Cart is empty, deleting cart');
                    $cart->delete();
                }
            } else {
                Log::info('PaymentController: No selected cart items provided');
            }
            return response()->json([
                'message' => 'Order confirmed successfully!',
                'payment' => $payment,
                'order'   => $order
            ], 200);
        });
    }
}
