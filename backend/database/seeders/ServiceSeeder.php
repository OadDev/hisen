<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\ServiceTicket;
use App\Models\User;
use App\Models\WarrantyClaim;
use Database\Seeders\Concerns\CreatesWithTimestamp;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    use CreatesWithTimestamp;

    private const ISSUES = [
        'Machine not powering on',
        'Spindle overheating during operation',
        'PLC throwing error code E-204',
        'Coolant leakage from pump',
        'Axis positioning inaccuracy',
        'Touchscreen unresponsive',
        'Unusual noise from gearbox',
        'Software licensing issue',
    ];

    public function run(): void
    {
        $customersWithMachines = Customer::has('installedMachines')->with('installedMachines')->get();
        $pool = $customersWithMachines->isEmpty() ? Customer::all() : $customersWithMachines;

        for ($i = 0; $i < 36; $i++) {
            $customer = $pool->random();
            $machine = $customer->installedMachines->first()?->product_name ?? 'HM CNC Router Pro';
            $status = fake()->randomElement(['open', 'open', 'in-progress', 'in-progress', 'in-progress', 'resolved', 'resolved', 'closed', 'closed', 'closed', 'closed']);
            $createdAt = fake()->dateTimeBetween('-45 days', 'now');
            $slaDue = (clone $createdAt)->modify('+'.fake()->randomElement([4, 8, 24, 48]).' hours');

            $this->createAt(ServiceTicket::class, [
                'code' => 'TCK-'.(1100 + $i),
                'customer_id' => $customer->id,
                'subject' => fake()->randomElement(self::ISSUES),
                'description' => fake()->sentences(2, true),
                'machine' => $machine,
                'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
                'status' => $status,
                'engineer_id' => User::randomOfRole('field_service_engineer')?->id,
                'sla_due_at' => $slaDue,
                'feedback_rating' => $status === 'closed' ? fake()->numberBetween(3, 5) : null,
            ], $createdAt);
        }

        for ($i = 0; $i < 10; $i++) {
            WarrantyClaim::create([
                'code' => 'WC-'.(300 + $i),
                'part_name' => fake()->randomElement(['Servo Drive Board', 'Ball Screw Assembly', 'Spindle Motor', 'PLC Control Module']),
                'customer_name' => fake()->company(),
                'status' => fake()->randomElement(['submitted', 'submitted', 'under-review', 'under-review', 'approved', 'approved', 'approved', 'rejected']),
                'submitted_on' => fake()->dateTimeBetween('-30 days', 'now'),
            ]);
        }
    }
}
