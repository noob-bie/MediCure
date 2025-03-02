<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    use HasFactory;

    protected $fillable = [
        'name', 'price', 'category', 'description', 'stock_quantity',
        'manufacturer', 'expiration_date', 'image','sales_count', 'generic_name',
        'dosage', 'indications', 'contraindications', 'brand', 'unit'
    ];
}