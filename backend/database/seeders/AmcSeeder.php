<?php

namespace Database\Seeders;

use App\Models\AmcContract;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class AmcSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::with(['installedMachines' => fn ($q) => $q->where('amc_active', true)])->get();
        $counter = 0;

        foreach ($customers as $customer) {
            foreach ($customer->installedMachines as $machine) {
                $start = fake()->dateTimeBetween('-1 year', 'now');
                $end = (clone $start)->modify('+1 year');
                $daysToExpiry = (strtotime($end->format('Y-m-d')) - time()) / 86400;

                AmcContract::create([
                    'code' => 'AMC-'.(5000 + $counter),
                    'customer_id' => $customer->id,
                    'installed_machine_id' => $machine->id,
                    'machine' => $machine->product_name,
                    'serial_number' => $machine->serial_number,
                    'start_date' => $start,
                    'end_date' => $end,
                    'visits_per_year' => 4,
                    'visits_completed' => fake()->numberBetween(0, 4),
                    'value' => fake()->numberBetween(45000, 280000),
                    'status' => $daysToExpiry < 0 ? 'expired' : ($daysToExpiry < 30 ? 'expiring-soon' : 'active'),
                    'assigned_engineer_id' => User::randomOfRole('field_service_engineer')?->id,
                ]);

                $counter++;
            }
        }
    }
}
