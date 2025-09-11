<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * GET /reviews
     * Fetch top reviews (default 3)
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 3);
        $reviews = $this->reviewService->getLatestReviews($limit);

        return response()->json($reviews);
    }

    /**
     * POST /reviews
     * Store a new review
     * Requires JWT authentication
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string|max:1000',
        ]);

        // Ensure user is authenticated via JwtMiddleware
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Create review
        $review = $this->reviewService->createReview($user, $validated);

        return response()->json($review, 201);
    }
}
