<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('sales_order_id')->constrained()->cascadeOnDelete();
            $table->string('machine_name');
            $table->enum('stage', ['Assembly', 'Electrical', 'PLC Programming', 'Testing', 'Final QC', 'Dispatch Ready'])->default('Assembly');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->foreignId('assigned_engineer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date');
            $table->date('due_date');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['on-track', 'delayed', 'completed'])->default('on-track');
            $table->timestamps();
        });

        Schema::create('mrp_requirements', function (Blueprint $table) {
            $table->id();
            $table->string('component');
            $table->unsignedInteger('required')->default(0);
            $table->unsignedInteger('in_stock')->default(0);
            $table->unsignedInteger('on_order')->default(0);
            $table->string('unit')->default('pcs');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mrp_requirements');
        Schema::dropIfExists('work_orders');
    }
};
