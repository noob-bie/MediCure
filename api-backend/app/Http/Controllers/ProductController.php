<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
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

    public function __construct(ProductService $productService, UserService $userService)
    {
        $this->productService = $productService;
        $this->userService = $userService;
    }
    /**
     * Process image data to ensure proper data URI format
     * 
     * @param string|null $imageData
     * @return string|null
     */
    private function processImageData($imageData)
    {
        if (empty($imageData)) {
            return null;
        }

        // If the image data already starts with "data:image/", return as is
        if (strpos($imageData, 'data:image/') === 0) {
            return $imageData;
        }

        // If it's just base64 string, add the data URI prefix
        // Defaulting to jpeg, but you could implement image type detection
        return 'data:image/jpeg;base64,' . $imageData;
    }
    // Fetch all products
    public function index(Request $request)
    {
        $category = $request->query('category');
        $sortBy = $request->query('sortBy');
        $sortDirection = $request->query('sortDirection', 'asc');

        try {
            if ($category) {
                $products = $this->productService->getProductsByCategory($category, $sortBy, $sortDirection);

                // Log for debugging
                Log::info('Fetching products for category: ' . $category);
                Log::info('Found products count: ' . $products->count());
            } else {
                $products = $this->productService->getAllProducts($sortBy, $sortDirection);
            }

            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch products'], 500);
        }
    }

    // Fetch a single product
    public function show($id)
    {
        try {
            $product = $this->productService->getProductById($id);
            return $product ? response()->json($product) : response()->json(['error' => 'Product not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch product'], 500);
        }
    }

    public function getCategories()
    {
        try {
            $categories = $this->productService->getAvailableCategories();
            return response()->json($categories);
        } catch (\Exception $e) {
            Log::error('Error fetching categories: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
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

    // Custom date validation rule
    private function validateProductDates($manufactureDate, $expirationDate)
    {
        if ($manufactureDate && $expirationDate) {
            $manufacture = new \DateTime($manufactureDate);
            $expiration = new \DateTime($expirationDate);

            if ($expiration <= $manufacture) {
                return false;
            }
        }
        return true;
    }
    // Add a product (Admin only)
    public function store(Request $request)
    {
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
 // ADD: Enhanced logging for debugging
        Log::info('Product creation request received:', [
            'user_id' => $userId,
            'request_data' => $request->all(),
            'has_image' => !empty($request->image)
        ]);

        try {
            // Base validation rules
            $rules = [
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'category' => ['required', 'string', Rule::in(['Medicines', 'Healthcare', 'Home Care', 'Baby & Mom Care'])],
                'description' => 'required|string',
                'stock_quantity' => 'required|integer|min:0',
                'manufacturer' => 'required|string|max:255',
                'expiration_date' => 'required|date|after:today',
                'manufacture_date' => 'required|date|before_or_equal:today',
                'image' => 'nullable|string', // Base64 encoded image
            ];

            // Category-specific validation rules
            if ($request->category === 'Medicines') {
                $rules['generic_name'] = 'required|string|max:255';
                $rules['dosage'] = 'required|string|max:100';
                $rules['indications'] = 'nullable|string';
                $rules['contraindications'] = 'nullable|string';
            } else {
                $rules['brand'] = 'required|string|max:255';
                $rules['unit'] = 'required|string|max:50';
            }

            // Validate the request
            $validatedData = $request->validate($rules);

            // Custom date validation
            if (!$this->validateProductDates($request->manufacture_date, $request->expiration_date)) {
                return response()->json([
                    'error' => 'Validation failed',
                    'details' => ['expiration_date' => ['Expiration date must be after manufacture date']]
                ], 422);
            }
            $imageData = $validatedData['image'] ?? null;
            if ($imageData) {
                $imageData = $this->processImageData($imageData);
            }

            // Prepare data for creation
            $productData = [
                'name' => $validatedData['name'],
                'price' => $validatedData['price'],
                'category' => $validatedData['category'],
                'description' => $validatedData['description'],
                'stock_quantity' => $validatedData['stock_quantity'],
                'manufacturer' => $validatedData['manufacturer'],
                'expiration_date' => $validatedData['expiration_date'],
                'manufacture_date' => $validatedData['manufacture_date'],
                'image' => $imageData,
                'sales_count' => 0,
            ];

            // Add category-specific fields
            if ($validatedData['category'] === 'Medicines') {
                $productData['generic_name'] = $validatedData['generic_name'];
                $productData['dosage'] = $validatedData['dosage'];
                $productData['indications'] = $validatedData['indications'] ?? null;
                $productData['contraindications'] = $validatedData['contraindications'] ?? null;
            } else {
                $productData['brand'] = $validatedData['brand'];
                $productData['unit'] = $validatedData['unit'];
            }

            // Create the product
            $product = $this->productService->createProduct($productData);

            Log::info('Product created successfully', ['product_id' => $product->id, 'admin_id' => $userId]);

            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Product validation failed', ['errors' => $e->errors(), 'admin_id' => $userId ?? null, 'request_data' => $request->all()]);
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // ADD: Enhanced error logging for debugging
            Log::error('Error creating product', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'admin_id' => $userId ?? null,
                'request_data' => $request->all()
            ]);
            return response()->json([
                'error' => 'Failed to create product',
                'message' => $e->getMessage() // ADD: Return actual error message for debugging
            ], 500);
        }
    }

    // Update a product (Admin only)
    public function update(Request $request, $id)
    {
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

        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            // Enhanced validation rules - INCLUDE sales_count
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric|min:0',
                'category' => ['sometimes', 'required', 'string', Rule::in(['Medicines', 'Healthcare', 'Home Care', 'Baby & Mom Care'])],
                'description' => 'sometimes|required|string',
                'stock_quantity' => 'sometimes|required|integer|min:0',
                'sales_count' => 'sometimes|integer|min:0', // ADDED: Allow sales_count updates
                'manufacturer' => 'sometimes|required|string|max:255',
                'expiration_date' => 'sometimes|required|date|after:today',
                'manufacture_date' => 'sometimes|required|date|before_or_equal:today',
                'image' => 'nullable|string',
            ];

            // Category-specific validation rules (if category is being updated or if it's a medicine)
            $category = $request->category ?? $product->category;
            if ($category === 'Medicines') { // Fixed: Use exact category name
                $rules['generic_name'] = 'sometimes|required|string|max:255';
                $rules['dosage'] = 'sometimes|required|string|max:100';
                $rules['indications'] = 'nullable|string';
                $rules['contraindications'] = 'nullable|string';
            } else {
                $rules['brand'] = 'sometimes|required|string|max:255';
                $rules['unit'] = 'sometimes|required|string|max:50';
            }

            $validatedData = $request->validate($rules);

            if (isset($validatedData['image']) && !empty($validatedData['image'])) {
                $validatedData['image'] = $this->processImageData($validatedData['image']);

                // ========== ADDED: Enhanced logging for image processing ==========
                Log::info('Image data processed for update:', [
                    'product_id' => $id,
                    'has_image' => !empty($validatedData['image']),
                    'image_starts_with_data_uri' => strpos($validatedData['image'], 'data:image/') === 0,
                    'image_length' => strlen($validatedData['image']),
                    'image_prefix' => substr($validatedData['image'], 0, 50) . '...'
                ]);
                // ========== END OF ADDED LOGGING ==========
            }

            // Log the incoming data for debugging
            Log::info('Product update request data:', [
                'product_id' => $id,
                'request_data' => $request->all(),
                'validated_data' => $validatedData
            ]);

            // Custom date validation if dates are provided
            $manufactureDate = $request->manufacture_date ?? $product->manufacture_date;
            $expirationDate = $request->expiration_date ?? $product->expiration_date;

            if (!$this->validateProductDates($manufactureDate, $expirationDate)) {
                return response()->json([
                    'error' => 'Validation failed',
                    'details' => ['expiration_date' => ['Expiration date must be after manufacture date']]
                ], 422);
            }

            // Update the product with validated data
            $updateResult = $product->update($validatedData);

            // Log the update result
            Log::info('Product update result:', [
                'product_id' => $id,
                'update_result' => $updateResult,
                'updated_fields' => array_keys($validatedData)
            ]);

            // Refresh the model to get updated data
            $updatedProduct = $product->fresh();
            if (isset($validatedData['image'])) {
                Log::info('Image update verification:', [
                    'product_id' => $id,
                    'image_updated' => !empty($updatedProduct->image),
                    'image_format_correct' => strpos($updatedProduct->image, 'data:image/') === 0,
                    'admin_id' => $userId
                ]);
            }
            Log::info('Product updated successfully', [
                'product_id' => $product->id,
                'admin_id' => $userId,
                'updated_sales_count' => $updatedProduct->sales_count
            ]);

            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $updatedProduct
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Product update validation failed:', [
                'product_id' => $id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating product:', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update product'], 500);
        }
    }

    // Delete a product (Admin only)
    public function destroy(Request $request, $id)
    {
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

        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $product->delete();

            Log::info('Product deleted successfully', ['product_id' => $id, 'admin_id' => $userId]);

            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting product: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete product'], 500);
        }
    }

}
