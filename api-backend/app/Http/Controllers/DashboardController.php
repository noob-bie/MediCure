<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardStats(Request $request)
    {
        try {
            $user = $request->user();
            
            Log::info('DashboardController: getDashboardStats - User:', ['user_id' => $user->id, 'role' => $user->role]);
            
            // Ensure only admin can access dashboard stats
            if ($user->role !== 'admin') {
                Log::warning('DashboardController: Unauthorized access attempt by user:', ['user_id' => $user->id, 'role' => $user->role]);
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get order statistics
            $totalOrders = Order::count();
            $pendingOrders = Order::where('status', 'pending')->count();
            $cancelledOrders = Order::where('status', 'cancelled')->count();
            $confirmedOrders = Order::where('status', 'confirmed')->count();

            // Get total delivery men count
            $totalDeliveryMen = User::where('role', 'delivery man')->count();

            // Get expired products count
            $expiredProducts = Product::where('expiration_date', '<', Carbon::now()->toDateString())->count();

            $stats = [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'cancelled_orders' => $cancelledOrders,
                'confirmed_orders' => $confirmedOrders,
                'total_delivery_men' => $totalDeliveryMen,
                'expired_products' => $expiredProducts
            ];

            Log::info('DashboardController: Statistics calculated:', $stats);

            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('DashboardController: getDashboardStats - Error: ' . $e->getMessage());
            Log::error('DashboardController: Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch dashboard statistics', 'message' => $e->getMessage()], 500);
        }
    }
}