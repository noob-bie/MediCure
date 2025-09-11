<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductService
{

    // Get all products by category
    public function getProductsByCategory($category, $sortBy = null, $sortDirection = 'asc', $limit = null)
    {
        $query = Product::where('category', $category)->where('expiration_date', '>', now());

        // Apply sorting
        if ($sortBy === 'sales_count') {
            $query->orderBy('sales_count', $sortDirection === 'desc' ? 'desc' : 'asc');
        } elseif ($sortBy === 'price') {
            $query->orderBy('price', $sortDirection === 'desc' ? 'desc' : 'asc');
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortDirection === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('created_at', 'desc'); // default newest first
        }

        // Apply limit if provided
        if ($limit) {
            $query->limit((int) $limit);
        }

        return $query->get();
    }


    public function getAllProducts($sortBy = null, $sortDirection = 'asc', $limit = null)
    {
        $query = Product::where('expiration_date', '>', now()); // Start with a query builder

        if ($sortBy === 'sales_count') {
            $query->orderBy('sales_count', $sortDirection === 'desc' ? 'desc' : 'asc');
        } elseif ($sortBy === 'price') {
            $query->orderBy('price', $sortDirection === 'desc' ? 'desc' : 'asc');
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortDirection === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('created_at', 'desc'); // default: newest first
        }

        if ($limit) {
            $query->limit((int) $limit); // apply limit if provided
        }

        return $query->get();
    }


    // FIXED: Get product by ID and remove null attributes
    public function getProductById($id)
    {
        // Use where() with find conditions instead of chaining after find()
        $product = Product::where('id', $id)
                         ->where('expiration_date', '>', now())
                         ->first();

        if ($product) {
            // Remove null attributes
            $productAttributes = $product->toArray();
            $filteredAttributes = array_filter($productAttributes, function ($value) {
                return !is_null($value);
            });

            return $filteredAttributes;
        }

        return null;
    }

    // Create a new product
    public function createProduct(array $data)
    {
        return Product::create($data);
    }

    public function getProductsCountByCategory($category = null)
    {
        if ($category) {
            return Product::where('category', $category)->count();
        }

        return Product::groupBy('category')
            ->selectRaw('category, count(*) as count')
            ->pluck('count', 'category')
            ->toArray();
    }

    // Get available categories with product counts
    public function getAvailableCategories()
    {
        return Product::where('expiration_date', '>', now()) // exclude expired
            ->select('category')
            ->selectRaw('count(*) as product_count')
            ->groupBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'display_name' => Product::getCategoryDisplayName($item->category),
                    'count' => $item->product_count
                ];
            });
    }
}
