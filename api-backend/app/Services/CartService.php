<?php

namespace App\Services;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CartService {
    public function getCartForUser($user) {
        return Cart::where('user_id', $user->id)
                   ->with('cartItems.product')
                   ->first();
    }

    public function addItemToCart($user, $data) {
        return DB::transaction(function () use ($user, $data) {
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            $cartItem = CartItem::where('cart_id', $cart->id)
                                ->where('product_id', $data['product_id'])
                                ->first();

            if ($cartItem) {
                $cartItem->quantity += $data['quantity'];
                $cartItem->save();
            } else {
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $data['product_id'],
                    'quantity' => $data['quantity']
                ]);
            }
            return $cartItem;
        });
    }

    public function updateCartItemQuantity($user, $cart_item_id, $data) {
        return CartItem::where('id', $cart_item_id)
                       ->whereHas('cart', fn($query) => $query->where('user_id', $user->id))
                       ->update(['quantity' => $data['quantity']]);
    }

    public function removeCartItem($cart_item_id) {
        return CartItem::where('id', $cart_item_id)->delete();
    }
}