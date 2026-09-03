<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('sales_order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->decimal('amount', 16, 2)->default(0);
            $table->decimal('amount_paid', 16, 2)->default(0);
            $table->string('currency', 3)->default('INR');
            $table->date('issued_date');
            $table->date('due_date');
            $table->enum('status', ['paid', 'partially-paid', 'pending', 'overdue'])->default('pending');
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('category');
            $table->string('description')->nullable();
            $table->decimal('amount', 14, 2)->default(0);
            $table->date('expense_date');
            $table->enum('status', ['pending', 'approved', 'reimbursed'])->default('pending');
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('payables', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('vendor_id')->nullable()->constrained('vendors')->nullOnDelete();
            $table->string('vendor_name');
            $table->decimal('amount', 16, 2)->default(0);
            $table->date('due_date');
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payables');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('invoices');
    }
};
