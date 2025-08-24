<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    // Get all orders for admin management
    public function index(Request $request)
    {
        try {
            $status = $request->query('status');

            $query = Order::with(['user', 'items.product', 'deliveryman', 'payment']);

            if ($status) {
                $query->where('status', $status);
            }

            $orders = $query->orderBy('created_at', 'desc')->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('AdminOrderController: index - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    // Get available delivery men
    public function getDeliverymen()
    {
        try {
            $deliverymen = User::where('role', 'delivery man')
                ->select('id', 'name', 'email', 'phone')
                ->get();

            return response()->json($deliverymen);
        } catch (\Exception $e) {
            Log::error('AdminOrderController: getDeliverymen - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch delivery men'], 500);
        }
    }

    // Assign deliveryman to order
    public function assignDeliveryman(Request $request, $orderId)
    {
        $request->validate([
            'deliveryman_id' => 'required|exists:users,id'
        ]);

        try {
            $order = Order::findOrFail($orderId);

            // Verify the deliveryman has the correct role
            $deliveryman = User::where('id', $request->deliveryman_id)
                ->where('role', 'delivery man')
                ->first();

            if (!$deliveryman) {
                return response()->json(['error' => 'Invalid delivery man selected'], 400);
            }

            $order->update([
                'deliveryman_id' => $request->deliveryman_id,
                'status' => 'assigned'
            ]);

            $order->load(['user', 'items.product', 'deliveryman', 'payment']);

            return response()->json([
                'message' => 'Deliveryman assigned successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('AdminOrderController: assignDeliveryman - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to assign deliveryman'], 500);
        }
    }

    // Update order status
    public function updateStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,assigned,on_the_way,delivered,cancelled'
        ]);

        try {
            $order = Order::findOrFail($orderId);

            $order->update(['status' => $request->status]);
            $order->load(['user', 'items.product', 'deliveryman', 'payment']);

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('AdminOrderController: updateStatus - Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update order status'], 500);
        }
    }
}
