<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrderService;
use Illuminate\Support\Facades\Log; // Import Log facade

class OrderController extends Controller {
    protected $orderService;

    public function __construct(OrderService $orderService) {
        $this->orderService = $orderService;
    }

    public function placeOrder(Request $request) {
        Log::info('OrderController: placeOrder - Request Data: ' . json_encode($request->all())); // Log all request data
        try {
            // Get selected order items from the request
            $selectedOrderItems = $request->input('order_items');
            $order = $this->orderService->placeOrder($request->user(), $selectedOrderItems);
            return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
        } catch (\Exception $e) {
            Log::error('OrderController: placeOrder - Exception: ' . $e->getMessage()); // Log exception message
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getOrders(Request $request) {
        return response()->json($this->orderService->getUserOrders($request->user()));
    }
}
