<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('company');
            $table->string('contact_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->nullable();
            $table->enum('source', ['Website', 'WhatsApp', 'Trade Show', 'Alibaba', 'Made-in-China', 'Email', 'Referral', 'Sales Executive']);
            $table->string('interested_product')->nullable();
            $table->decimal('estimated_value', 14, 2)->default(0);
            $table->enum('stage', ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won', 'Lost'])->default('Lead');
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('lost_reason')->nullable();
            $table->dateTime('next_follow_up')->nullable();
            $table->timestamps();
        });

        Schema::create('lead_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['call', 'meeting', 'email', 'whatsapp', 'note', 'stage-change']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('occurred_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_activities');
        Schema::dropIfExists('leads');
    }
};
