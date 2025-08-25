<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->string('category');
            $table->text('description')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->string('manufacturer');
            $table->date('expiration_date');
            $table->date('manufacture_date');
            $table->longText('image')->nullable();
            $table->integer('sales_count')->default(0);
            // Medicine-Specific Attributes (Nullable for normal products)
            $table->string('generic_name')->nullable();
            $table->string('dosage')->nullable();
            $table->string('indications')->nullable();
            $table->string('contraindications')->nullable();
            // Normal Product-Specific Attributes (Nullable for medicines)
            $table->string('brand')->nullable();
            $table->string('unit')->nullable(); // e.g., 'ml', 'gm', 'piece' - for lotion, balm etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
