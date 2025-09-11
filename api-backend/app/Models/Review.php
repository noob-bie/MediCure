<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'rating', 'message'];

    // Relationship: Review belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
