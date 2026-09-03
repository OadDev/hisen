<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qc_inspections', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('work_order_id')->constrained()->cascadeOnDelete();
            $table->enum('stage', ['Incoming', 'Assembly', 'Electrical', 'PLC', 'Final', 'Packing']);
            $table->foreignId('inspector_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('inspected_on');
            $table->enum('result', ['passed', 'failed', 'pending'])->default('pending');
            $table->unsignedTinyInteger('checklist_items')->default(0);
            $table->unsignedTinyInteger('checklist_passed')->default(0);
            $table->timestamps();
        });

        Schema::create('ncrs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('work_order_id')->constrained()->cascadeOnDelete();
            $table->enum('stage', ['Incoming', 'Assembly', 'Electrical', 'PLC', 'Final', 'Packing']);
            $table->text('description');
            $table->enum('severity', ['minor', 'major', 'critical'])->default('minor');
            $table->enum('status', ['open', 'under-review', 'closed'])->default('open');
            $table->foreignId('raised_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('raised_on');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ncrs');
        Schema::dropIfExists('qc_inspections');
    }
};
