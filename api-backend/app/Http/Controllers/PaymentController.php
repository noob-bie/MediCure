<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PaymentService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function confirmOrder(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $payment = $this->paymentService->confirmOrder($user, $validated['order_id']);

        if ($payment) {
            return response()->json([
                'message' => 'Order confirmed with Cash on Delivery!',
                'order_id' => $payment->order_id,
                'payment_status' => $payment->payment_status
            ], 200);
        }

        return response()->json(['message' => 'Failed to confirm order.'], 400);
    }
}