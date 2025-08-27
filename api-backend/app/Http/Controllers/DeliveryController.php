<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class DeliveryController extends Controller
{
    // Get orders assigned to the logged-in delivery man
    public function getMyOrders(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->role !== 'delivery man') {
                return response()->json(['error' => 'Access denied'], 403);
            }

            $orders = Order::with(['user', 'items.product', 'payment'])
                ->where('deliveryman_id', $user->id)
                ->whereIn('status', ['assigned', 'on_the_way'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('DeliveryController: getMyOrders - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    // Get delivery history for the logged-in delivery man
    public function getDeliveryHistory(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->role !== 'delivery man') {
                return response()->json(['error' => 'Access denied'], 403);
            }

            $orders = Order::with(['user', 'items.product', 'payment'])
                ->where('deliveryman_id', $user->id)
                ->where('status', 'delivered')
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('DeliveryController: getDeliveryHistory - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch delivery history'], 500);
        }
    }

    // ✅ Updated method to handle payment status
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:on_the_way,delivered',
            'payment_collected' => 'boolean' // ✅ Optional field for COD payment collection
        ]);

        try {
            $user = $request->user();

            if ($user->role !== 'delivery man') {
                return response()->json(['error' => 'Access denied'], 403);
            }

            $order = Order::with('payment')
                ->where('id', $orderId)
                ->where('deliveryman_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json(['error' => 'Order not found or not assigned to you'], 404);
            }

            // Update order status
            $order->update(['status' => $request->status]);

            // ✅ Handle payment status for COD orders
            if ($order->payment && $order->payment->payment_method === 'cash_on_delivery') {

                // If marking as delivered, automatically mark payment as collected
                if ($request->status === 'delivered') {
                    $order->payment->update(['payment_status' => 'paid']);
                    Log::info("Payment marked as collected for COD order: {$orderId}");
                }

                // OR if explicitly stating payment was collected
                if ($request->input('payment_collected', false)) {
                    $order->payment->update(['payment_status' => 'paid']);
                    Log::info("Payment manually marked as collected for order: {$orderId}");
                }
            }

            $order->load(['user', 'items.product', 'payment']);

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('DeliveryController: updateOrderStatus - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update order status'], 500);
        }
    }

    // ✅ New method specifically for collecting COD payments
    public function collectPayment(Request $request, $orderId)
    {
        try {
            $user = $request->user();

            if ($user->role !== 'delivery man') {
                return response()->json(['error' => 'Access denied'], 403);
            }

            $order = Order::with('payment')
                ->where('id', $orderId)
                ->where('deliveryman_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json(['error' => 'Order not found or not assigned to you'], 404);
            }

            if (!$order->payment || $order->payment->payment_method !== 'cash_on_delivery') {
                return response()->json(['error' => 'This order is not a COD order'], 400);
            }

            if ($order->payment->payment_status === 'paid') {
                return response()->json(['error' => 'Payment already collected'], 400);
            }

            // Update payment status
            $order->payment->update(['payment_status' => 'paid']);

            $order->load(['user', 'items.product', 'payment']);

            return response()->json([
                'message' => 'Payment collected successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('DeliveryController: collectPayment - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to collect payment'], 500);
        }
    }
}
