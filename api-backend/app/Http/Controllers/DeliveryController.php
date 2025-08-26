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

    // Update order status by delivery man
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:on_the_way,delivered'
        ]);

        try {
            $user = $request->user();

            if ($user->role !== 'delivery man') {
                return response()->json(['error' => 'Access denied'], 403);
            }

            $order = Order::where('id', $orderId)
                ->where('deliveryman_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json(['error' => 'Order not found or not assigned to you'], 404);
            }

            $order->update(['status' => $request->status]);
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
}
