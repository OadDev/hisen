<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('city')->nullable();
            $table->enum('type', ['main', 'regional', 'bonded'])->default('regional');
            $table->unsignedTinyInteger('capacity_pct')->default(0);
            $table->unsignedInteger('bin_locations')->default(0);
            $table->timestamps();
        });

        Schema::create('stock_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('sku');
            $table->string('name');
            $table->string('category')->nullable();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->string('bin_location')->nullable();
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('reorder_level')->default(0);
            $table->string('unit')->default('pcs');
            $table->string('batch_number')->nullable();
            $table->unsignedInteger('aging_days')->default(0);
            $table->enum('status', ['in_stock', 'low_stock', 'out_of_stock'])->default('in_stock');
            $table->timestamps();
        });

        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('item');
            $table->unsignedInteger('quantity')->default(1);
            $table->foreignId('from_warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->foreignId('to_warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->enum('status', ['pending', 'in-transit', 'completed'])->default('pending');
            $table->date('requested_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfers');
        Schema::dropIfExists('stock_items');
        Schema::dropIfExists('warehouses');
    }
};
