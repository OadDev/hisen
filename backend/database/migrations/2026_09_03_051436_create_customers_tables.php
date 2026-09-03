<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('industry')->nullable();
            $table->string('gstin')->nullable();
            $table->string('pan_number')->nullable();
            $table->string('currency', 3)->default('INR');
            $table->decimal('credit_limit', 14, 2)->default(0);
            $table->unsignedSmallInteger('credit_days')->default(0);
            $table->foreignId('account_owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['active', 'inactive', 'prospect'])->default('prospect');
            $table->json('tags')->nullable();
            $table->decimal('lifetime_value', 16, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('customer_branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_head_office')->default(false);
            $table->timestamps();
        });

        Schema::create('customer_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('installed_machines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('product_name');
            $table->string('serial_number')->unique();
            $table->date('installed_on');
            $table->date('warranty_ends_on');
            $table->boolean('amc_active')->default(false);
            $table->enum('status', ['operational', 'under-service', 'decommissioned'])->default('operational');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installed_machines');
        Schema::dropIfExists('customer_contacts');
        Schema::dropIfExists('customer_branches');
        Schema::dropIfExists('customers');
    }
};
