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

    private function validateToken(string $tokenString): ?object
    {
        try {
            $jwtConfig = $this->userService->getJwtConfig();
            $token = $jwtConfig->parser()->parse($tokenString);

            $constraints = [
                new SignedWith($jwtConfig->signer(), $jwtConfig->signingKey()),
                new IssuedBy('http://localhost'),
                new PermittedFor('http://localhost:5173'),
                // new IssuedAt(SystemClock::fromUTC()),
                new ValidAt(SystemClock::fromUTC()),
            ];

            $jwtConfig->validator()->assert($token, ...$constraints);

            return $token;
        } catch (RequiredConstraintsViolated $e) {
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }
    // Add a product (Admin only)
    public function store(Request $request) {
        $tokenString = $request->bearerToken();
        if (!$tokenString) {
            return response()->json(['error' => 'Unauthorized - No token provided'], 401);
        }

        $token = $this->validateToken($tokenString);

        if (!$token) {
            return response()->json(['error' => 'Invalid token'], 401);
        }


            $userId = $token->claims()->get('uid');
            $userRole = $token->claims()->get('role');

            $user = User::find($userId);

            if (!$user || $userRole !== 'admin') {
                return response()->json(['error' => 'Unauthorized - Admin role required'], 403);
            }



        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'manufacturer' => 'nullable|string',
            'expiration_date' => 'nullable|date',
            'image' => 'nullable|string',
            'generic_name' => 'nullable|string',
            'dosage' => 'nullable|string',
            'indications' => 'nullable|string',
            'contraindications' => 'nullable|string',
            'brand' => 'nullable|string',
            'unit' => 'nullable|string'
        ]);

        $product = $this->productService->createProduct($request->all());
        return response()->json($product, 201);
    }





}
