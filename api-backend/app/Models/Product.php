<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'category',
        'description',
        'stock_quantity',
        'manufacturer',
        'expiration_date',
        'image',
        'sales_count',
        'generic_name',
        'dosage',
        'indications',
        'contraindications',
        'brand',
        'unit'
    ];
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    protected $casts = [
        'price' => 'decimal:2',
        'expiration_date' => 'date',
        'sales_count' => 'integer',
        'stock_quantity' => 'integer'
    ];

    // Scope for filtering by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Scope for available products (in stock)
    public function scopeAvailable($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    // Scope for sorting by sales count
    public function scopeBestSelling($query, $order = 'desc')
    {
        return $query->orderBy('sales_count', $order);
    }

    // Scope for sorting by price
    public function scopeByPrice($query, $order = 'asc')
    {
        return $query->orderBy('price', $order);
    }

    // Accessor for formatted price
    public function getFormattedPriceAttribute()
    {
        return '৳' . number_format($this->price, 2);
    }

    // Check if product is medicine
    public function getIsMedicineAttribute()
    {
        return !empty($this->generic_name) || !empty($this->dosage);
    }

    // Get category display name
    public static function getCategoryDisplayName($category)
    {
        $categories = [
            'medicines' => 'Medicines',
            'healthcare' => 'Healthcare',
            'homecare' => 'Home Care',
            'baby&momcare' => 'Baby & Mom Care'
        ];

        return $categories[$category] ?? ucfirst($category);
    }

    // Get all available categories
    public static function getAvailableCategories()
    {
        return self::select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();
    }
}
