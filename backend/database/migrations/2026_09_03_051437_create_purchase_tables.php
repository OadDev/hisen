<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfqs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('item');
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedTinyInteger('vendors_invited')->default(0);
            $table->unsignedTinyInteger('quotes_received')->default(0);
            $table->enum('status', ['open', 'closed', 'awarded'])->default('open');
            $table->date('due_date')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('rfq_id')->nullable()->constrained('rfqs')->nullOnDelete();
            $table->string('item');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 14, 2)->default(0);
            $table->decimal('total_value', 16, 2)->default(0);
            $table->enum('status', ['draft', 'pending', 'approved', 'dispatched', 'received', 'cancelled'])->default('draft');
            $table->date('order_date');
            $table->date('expected_delivery')->nullable();
            $table->timestamps();
        });

        Schema::create('goods_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->string('item');
            $table->unsignedInteger('quantity_received')->default(0);
            $table->unsignedInteger('quantity_ordered')->default(0);
            $table->date('received_date');
            $table->enum('qc_status', ['pending', 'passed', 'failed'])->default('pending');
            $table->string('warehouse')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goods_receipts');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('rfqs');
    }
};
