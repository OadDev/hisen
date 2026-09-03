<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('quotation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'in-progress', 'production', 'dispatched', 'installed', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['pending', 'partially-paid', 'paid', 'overdue'])->default('pending');
            $table->decimal('order_value', 16, 2)->default(0);
            $table->decimal('advance_paid', 16, 2)->default(0);
            $table->string('currency', 3)->default('INR');
            $table->date('order_date');
            $table->date('expected_dispatch')->nullable();
            $table->unsignedTinyInteger('production_progress')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_orders');
    }
};
