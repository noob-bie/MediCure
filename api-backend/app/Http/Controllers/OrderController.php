<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrderService;
use Illuminate\Support\Facades\Log;
use App\Models\Order;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        // Fetch orders with related items and products
        $orders = Order::with(['items.product'])->get();

        return response()->json($orders);
    }

    public function placeOrder(Request $request)
    {
        Log::info('OrderController: placeOrder - Request Data: ' . json_encode($request->all()));

        try {
            $selectedOrderItems = $request->input('order_items');
            $paymentMethod = $request->input('payment_method'); // ✅ From frontend

            $order = $this->orderService->placeOrder(
                $request->user(),
                $selectedOrderItems,
                $paymentMethod // ✅ Pass payment method
            );

            return response()->json([
                'message' => 'Order placed successfully',
                'order'   => $order
            ], 201);
        } catch (\Exception $e) {
            Log::error('OrderController: placeOrder - Exception: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getOrders(Request $request)
    {
        return response()->json($this->orderService->getUserOrders($request->user()));
    }

    public function pendingPayments(Request $request)
    {
        $user = $request->user();

        // Fetch orders that belong to the user and have payment_status = yet_to_pay
        $orders = Order::with('payment') // assumes Order has `payment()` relation
            ->where('user_id', $user->id)
            ->whereHas('payment', function ($q) {
                $q->where('payment_status', 'yet_to_pay');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function cancelOrder(Request $request, $orderId)
    {
        $order = Order::where('id', $orderId)
                      ->where('user_id', $request->user()->id)
                      ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Only allow cancellation for certain statuses
        if (in_array($order->status, ['pending', 'confirmed'])) {
            $order->status = 'cancelled';
            $order->save();

            Log::info('Order cancelled successfully', ['order_id' => $orderId, 'user_id' => $request->user()->id]);

            return response()->json(['message' => 'Order cancelled successfully']);
        }

        return response()->json(['message' => 'Cannot cancel order at this stage'], 400);
    }
}
