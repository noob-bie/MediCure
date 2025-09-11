<?php

namespace App\Services;

use App\Models\Review;
use App\Models\User;

class ReviewService
{
    // Fetch latest reviews
    public function getLatestReviews($limit = 3)
    {
        return Review::with('user')
            ->orderByDesc('rating')  // highest rating first
            ->orderByDesc('created_at') // tie-breaker: most recent
            ->take($limit)
            ->get();
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
