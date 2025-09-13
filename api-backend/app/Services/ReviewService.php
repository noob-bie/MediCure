<?php

namespace App\Services;

use App\Models\Review;
use App\Models\User;

class ReviewService
{
    // Fetch reviews with sorting and limit options
    public function getLatestReviews($limit = 3, $sortBy = 'rating', $sortDirection = 'desc', $all = false)
    {
        $query = Review::with('user');

        // When fetching all reviews, always sort by rating first
        if ($all) {
            // For "View All Reviews": Sort by rating (highest to lowest), then by creation date (newest first)
            $query->orderByDesc('rating')
                  ->orderByDesc('created_at');
        } else {
            // For top reviews: Sort by rating (highest to lowest), then by creation date (newest first)
            $query->orderByDesc('rating')
                  ->orderByDesc('created_at');
        }

        // Apply limit only if not fetching all reviews
        if (!$all && $limit > 0) {
            $query->take($limit);
        }

        return $query->get();
    }

    // Create a new review
    public function createReview(User $user, array $data)
    {
        return Review::create([
            'user_id' => $user->id,
            'rating'  => $data['rating'],
            'message' => $data['message'],
        ])->load('user');
    }
}