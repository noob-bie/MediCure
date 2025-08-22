<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Cart;       // ✅ add
use App\Models\CartItem;   // ✅ add
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function confirmOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id'
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

            // ✅ Clear the user's active cart (so Cart page shows empty)
            $cart = Cart::where('user_id', $user->id)->first();
            if ($cart) {
                CartItem::where('cart_id', $cart->id)->delete();
                $cart->delete(); // remove the cart itself so a fresh one is created next time
            }

            return response()->json([
                'message' => 'Order confirmed successfully!',
                'payment' => $payment,
                'order'   => $order
            ], 200);
        });
    }
}
