<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductService
{

    // Get all products by category
    public function getProductsByCategory($category, $sortBy = null, $sortDirection = 'asc')
    {
        $query = Product::where('category', $category);
        if ($sortBy === 'sales_count') {
            $query->orderBy('sales_count', ($sortDirection === 'desc' ? 'desc' : 'asc'));
        } elseif ($sortBy === 'price') {
            $query->orderBy('price', ($sortDirection === 'desc' ? 'desc' : 'asc'));
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', ($sortDirection === 'desc' ? 'desc' : 'asc'));
        } else {
            // Default sorting by created_at (newest first)
            $query->orderBy('created_at', 'desc');
        }
        return $query->get();
    }

    public function getAllProducts($sortBy = null, $sortDirection = 'asc')
    {
        $query = Product::query(); // Start with a query builder

        if ($sortBy === 'sales_count') { // Check if sortBy is 'sales_count'
            $query->orderBy('sales_count', ($sortDirection === 'desc' ? 'desc' : 'asc')); // Add orderBy clause for sales_count
        } elseif ($sortBy === 'price') {
            $query->orderBy('price', ($sortDirection === 'desc' ? 'desc' : 'asc'));
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', ($sortDirection === 'desc' ? 'desc' : 'asc'));
        } else {
            // Default sorting by created_at (newest first)
            $query->orderBy('created_at', 'desc');
        }
        // You can add more sorting options here in the future (e.g., for price, name, etc.)

        return $query->get();
    }

    // Get product by ID and remove null attributes
    public function getProductById($id)
    {
        $product = Product::find($id);

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
        return Product::select('category')
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
