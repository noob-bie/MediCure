<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\JWT\Validation\Constraint\IssuedAt;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;

class ProductController extends Controller
{
    protected $productService;
    protected $userService;

    public function __construct(ProductService $productService, UserService $userService) {
        $this->productService = $productService;
        $this->userService = $userService;
    }

    // Fetch all products
    public function index(Request $request) {
        $category = $request->query('category');
        $sortBy = $request->query('sortBy');
        $sortDirection = $request->query('sortDirection', 'asc');

        if ($category) {
            $products = $this->productService->getProductsByCategory($category,$sortBy, $sortDirection ); // Fetch products by category
        } else {
            $products = $this->productService->getAllProducts($sortBy, $sortDirection); // Fetch all products if no category parameter
        }
        return response()->json($products);
    }

    // Fetch a single product
    public function show($id) {
        $product = $this->productService->getProductById($id);
        return $product ? response()->json($product) : response()->json(['error' => 'Product not found'], 404);
    }

    

    
    
}