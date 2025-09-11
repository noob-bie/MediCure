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
            $assignedOrders = Order::where('status', 'assigned')->count();
            $onTheWayOrders = Order::where('status', 'on_the_way')->count();
            $deliveredOrders = Order::where('status', 'delivered')->count();
            $completedOrders = Order::where('status', 'completed')->count();

            // Get total delivery men count
            $totalDeliveryMen = User::where('role', 'delivery man')->count();

            // Get expired products count - fix the date comparison
            $today = Carbon::now()->format('Y-m-d');
            $expiredProducts = Product::whereDate('expiration_date', '<', $today)->count();
            
            Log::info('DashboardController: Expired products check:', [
                'today' => $today,
                'expired_count' => $expiredProducts,
                'sample_products' => Product::select('name', 'expiration_date')
                    ->whereDate('expiration_date', '<', $today)
                    ->limit(3)
                    ->get()
                    ->toArray()
            ]);

            $stats = [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'cancelled_orders' => $cancelledOrders,
                'confirmed_orders' => $confirmedOrders,
                'assigned_orders' => $assignedOrders,
                'on_the_way_orders' => $onTheWayOrders,
                'delivered_orders' => $deliveredOrders,
                'completed_orders' => $completedOrders,
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