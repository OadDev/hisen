<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->enum('category', ['Machines', 'Accessories', 'Consumables', 'Spare Parts']);
            $table->string('sub_category')->nullable();
            $table->text('description')->nullable();
            $table->string('hsn')->nullable();
            $table->string('unit')->default('Unit');
            $table->decimal('price', 14, 2)->default(0);
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['active', 'discontinued', 'draft'])->default('active');
            $table->json('specs')->nullable();
            $table->json('certifications')->nullable();
            $table->boolean('has_video')->default(false);
            $table->boolean('has_pdf_catalog')->default(false);
            $table->unsignedSmallInteger('warranty_months')->default(0);
            $table->unsignedSmallInteger('lead_time_days')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
