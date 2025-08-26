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
    ];

    public function assignedOrders()
   {
       return $this->hasMany(Order::class, 'deliveryman_id');
   }

}
