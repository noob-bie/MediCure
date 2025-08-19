<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function confirmOrder($user, $orderId)
    {
        return DB::transaction(function () use ($user, $orderId) {
            $order = Order::where('id', $orderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return null; // Order not found
            }

            // Insert payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'cash_on_delivery',
                'payment_status' => 'yet_to_pay',
            ]);

            // Force update status to "Confirmed" bypassing enum check
            DB::table('orders')
                ->where('id', $order->id)
                ->update(['status' => 'Confirmed']);

            return $payment;
        });
    }
}
