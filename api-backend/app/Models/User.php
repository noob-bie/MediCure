<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'address',
        'role',
        'name_changed_at',
        'profile_image',
    ];
    protected $casts = [
        'name_changed_at' => 'datetime',
    ];
        protected $appends = [
        'profile_image_url'
    ];
    public function assignedOrders()
    {
        return $this->hasMany(Order::class, 'deliveryman_id');
    }
    public function canChangeName()
    {
        return is_null($this->name_changed_at);
    }

    // Helper method to get profile image URL
    public function getProfileImageUrlAttribute()
    {
        if ($this->profile_image) {
            return asset('storage/profiles/' . $this->profile_image);
        }
        return null;
    }
    
}
