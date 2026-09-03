<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('sales_order_id')->constrained()->cascadeOnDelete();
            $table->string('destination')->nullable();
            $table->string('container_no')->nullable();
            $table->enum('mode', ['road', 'sea', 'air'])->default('road');
            $table->enum('status', ['packing', 'ready', 'in-transit', 'delivered'])->default('packing');
            $table->date('dispatch_date')->nullable();
            $table->date('eta')->nullable();
            $table->boolean('export_docs_ready')->default(false);
            $table->timestamps();
        });

        Schema::create('installations', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('sales_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('engineer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('scheduled_date');
            $table->enum('status', ['scheduled', 'in-progress', 'completed'])->default('scheduled');
            $table->unsignedTinyInteger('checklist_done')->default(0);
            $table->unsignedTinyInteger('checklist_total')->default(12);
            $table->boolean('customer_signed')->default(false);
            $table->boolean('training_completed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installations');
        Schema::dropIfExists('shipments');
    }
};
