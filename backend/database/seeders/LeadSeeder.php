<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\Concerns\CreatesWithTimestamp;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    use CreatesWithTimestamp;

    private const SOURCES = ['Website', 'WhatsApp', 'Trade Show', 'Alibaba', 'Made-in-China', 'Email', 'Referral', 'Sales Executive'];

    private const STAGES = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance'];

    private const LOST_REASONS = ['Price too high', 'Chose competitor', 'Budget deferred', 'No response', 'Requirement changed', 'Financing not approved'];

    private const COUNTRIES = ['India', 'UAE', 'Saudi Arabia', 'Nigeria', 'Kenya', 'Indonesia', 'Vietnam', 'Bangladesh'];

    private const ACTIVITY_TITLES = [
        'call' => 'Outbound call',
        'meeting' => 'Site / video meeting',
        'email' => 'Email sent',
        'whatsapp' => 'WhatsApp message',
        'note' => 'Internal note added',
    ];

    public function run(): void
    {
        $machines = Product::where('category', 'Machines')->get();

        for ($i = 0; $i < 64; $i++) {
            $isLost = fake()->boolean(18);
            $stage = $isLost ? 'Lost' : (fake()->boolean(8) ? 'Won' : fake()->randomElement(self::STAGES));
            $createdAt = fake()->dateTimeBetween('-1 year', '-1 month');
            $owner = User::randomOfRole('sales_executive');

            $lead = $this->createAt(Lead::class, [
                'code' => 'LD-'.(2000 + $i),
                'company' => trim(preg_replace('/,?\s*(LLC|Inc\.?|Ltd\.?)$/i', '', fake()->company())).' '.fake()->randomElement(['Industries', 'Engineering', 'Manufacturing Co.', 'Trading LLC']),
                'contact_name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->phoneNumber(),
                'country' => fake()->randomElement(self::COUNTRIES),
                'source' => fake()->randomElement(self::SOURCES),
                'interested_product' => $machines->random()->name,
                'estimated_value' => fake()->numberBetween(350000, 9500000),
                'stage' => $stage,
                'owner_id' => $owner?->id,
                'lost_reason' => $isLost ? fake()->randomElement(self::LOST_REASONS) : null,
                'next_follow_up' => (! $isLost && $stage !== 'Won') ? fake()->dateTimeBetween('now', '+14 days') : null,
            ], $createdAt);

            $activityCount = fake()->numberBetween(2, 6);
            for ($a = 0; $a < $activityCount; $a++) {
                $type = fake()->randomElement(array_keys(self::ACTIVITY_TITLES));

                LeadActivity::create([
                    'lead_id' => $lead->id,
                    'type' => $type,
                    'title' => self::ACTIVITY_TITLES[$type],
                    'description' => fake()->sentence(),
                    'actor_id' => User::randomOfRole('sales_executive')?->id,
                    'occurred_at' => fake()->dateTimeBetween('-45 days', 'now'),
                ]);
            }

            LeadActivity::create([
                'lead_id' => $lead->id,
                'type' => 'stage-change',
                'title' => "Stage moved to {$stage}",
                'actor_id' => $owner?->id,
                'occurred_at' => fake()->dateTimeBetween('-10 days', 'now'),
            ]);
        }
    }
}
