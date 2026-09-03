<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedTinyInteger('on_time_delivery_pct')->default(0);
            $table->unsignedTinyInteger('quality_score')->default(0);
            $table->unsignedSmallInteger('lead_time_days')->default(0);
            $table->json('certifications')->nullable();
            $table->unsignedInteger('total_orders')->default(0);
            $table->decimal('total_spend', 16, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'blacklisted'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
