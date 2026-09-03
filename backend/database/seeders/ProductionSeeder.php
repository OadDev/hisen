<?php

namespace Database\Seeders;

use App\Models\MrpRequirement;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    private const STAGES = ['Assembly', 'Electrical', 'PLC Programming', 'Testing', 'Final QC', 'Dispatch Ready'];

    private const COMPONENTS = ['Servo Motor', 'Ball Screw Assembly', 'Linear Guide Rail', 'PLC Module', 'Spindle Unit', 'Control Panel', 'Timing Belt', 'Limit Switch', 'Cable Harness', 'Cooling Fan'];

    public function run(): void
    {
        $salesOrders = SalesOrder::all();
        $machines = Product::where('category', 'Machines')->get();

        for ($i = 0; $i < 30; $i++) {
            $startDate = fake()->dateTimeBetween('-45 days', 'now');
            $status = fake()->randomElement(['on-track', 'on-track', 'on-track', 'on-track', 'on-track', 'on-track', 'delayed', 'delayed', 'completed', 'completed', 'completed']);

            WorkOrder::create([
                'code' => 'WO-'.(2100 + $i),
                'sales_order_id' => $salesOrders[$i % $salesOrders->count()]->id,
                'machine_name' => $machines->random()->name,
                'stage' => $status === 'completed' ? 'Dispatch Ready' : fake()->randomElement(self::STAGES),
                'progress' => $status === 'completed' ? 100 : fake()->numberBetween(5, 95),
                'assigned_engineer_id' => User::randomOfRole('production_engineer')?->id,
                'start_date' => $startDate,
                'due_date' => (clone $startDate)->modify('+'.fake()->numberBetween(15, 40).' days'),
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
                'status' => $status,
            ]);
        }

        for ($i = 0; $i < 16; $i++) {
            $required = fake()->numberBetween(20, 400);
            $inStock = fake()->numberBetween(0, $required);

            MrpRequirement::create([
                'component' => fake()->randomElement(self::COMPONENTS),
                'required' => $required,
                'in_stock' => $inStock,
                'on_order' => fake()->numberBetween(0, max(0, $required - $inStock)),
                'unit' => 'pcs',
            ]);
        }
    }
}
