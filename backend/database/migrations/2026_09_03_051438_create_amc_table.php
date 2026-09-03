<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amc_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('installed_machine_id')->nullable()->constrained('installed_machines')->nullOnDelete();
            $table->string('machine');
            $table->string('serial_number');
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedTinyInteger('visits_per_year')->default(4);
            $table->unsignedTinyInteger('visits_completed')->default(0);
            $table->decimal('value', 14, 2)->default(0);
            $table->enum('status', ['active', 'expiring-soon', 'expired'])->default('active');
            $table->foreignId('assigned_engineer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amc_contracts');
    }
};
