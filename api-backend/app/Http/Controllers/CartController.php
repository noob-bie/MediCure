<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        return response()->json($this->cartService->getCartForUser($request->user()));
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        return response()->json($this->cartService->addItemToCart($request->user(), $request->all()));
    }

    public function updateItem(Request $request, $cart_item_id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        return response()->json($this->cartService->updateCartItemQuantity($request->user(), $cart_item_id, $request->all()));
    }
    /*
public function removeItems(Request $request) {
    $request->validate([
        'item_ids' => 'required|array',
        'item_ids.*' => 'integer|exists:cart_items,id'
    ]);

    CartItem::whereIn('id', $request->item_ids)
            ->whereHas('cart', fn($q) => $q->where('user_id', $request->user()->id))
            ->delete();

    return response()->json(['message' => 'Selected items removed']);
}*/
    public function removeSelectedItems(Request $request)
    {
        $request->validate([
            'item_ids' => 'required|array',
            'item_ids.*' => 'integer|exists:cart_items,id'
        ]);

        // Delete only selected items belonging to the authenticated user
        \App\Models\CartItem::whereIn('id', $request->item_ids)
            ->whereHas('cart', fn($q) => $q->where('user_id', $request->user()->id))
            ->delete();

        return response()->json(['message' => 'Selected items removed from cart']);
    }
    
}
