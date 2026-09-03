<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bom_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('machine_product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('bom_components')->cascadeOnDelete();
            $table->string('part_no');
            $table->string('name');
            $table->unsignedInteger('quantity')->default(1);
            $table->string('unit')->default('pcs');
            $table->decimal('unit_cost', 14, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bom_components');
    }
};
