<?php

namespace Database\Seeders;

use App\Models\Ncr;
use App\Models\QcInspection;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;

class QualitySeeder extends Seeder
{
    private const STAGES = ['Incoming', 'Assembly', 'Electrical', 'PLC', 'Final', 'Packing'];

    private const DEFECTS = ['Spindle vibration out of tolerance', 'Paint finish defect on frame', 'Wiring harness incorrectly routed', 'PLC program version mismatch', 'Dimensional deviation on base plate', 'Loose fastener on gantry assembly'];

    public function run(): void
    {
        $workOrders = WorkOrder::all();

        for ($i = 0; $i < 40; $i++) {
            $checklistItems = fake()->numberBetween(8, 20);
            $result = fake()->randomElement(['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'failed', 'pending', 'pending']);

            QcInspection::create([
                'code' => 'QC-'.(7700 + $i),
                'work_order_id' => $workOrders->random()->id,
                'stage' => fake()->randomElement(self::STAGES),
                'inspector_id' => User::randomOfRole('quality_manager')?->id,
                'inspected_on' => fake()->dateTimeBetween('-30 days', 'now'),
                'result' => $result,
                'checklist_items' => $checklistItems,
                'checklist_passed' => $result === 'passed' ? $checklistItems : ($result === 'failed' ? fake()->numberBetween(0, $checklistItems - 1) : 0),
            ]);
        }

        for ($i = 0; $i < 12; $i++) {
            Ncr::create([
                'code' => 'NCR-'.(100 + $i),
                'work_order_id' => $workOrders->random()->id,
                'stage' => fake()->randomElement(self::STAGES),
                'description' => fake()->randomElement(self::DEFECTS),
                'severity' => fake()->randomElement(['minor', 'major', 'critical']),
                'status' => fake()->randomElement(['open', 'open', 'under-review', 'under-review', 'closed', 'closed', 'closed']),
                'raised_by' => User::randomOfRole('quality_manager')?->id,
                'raised_on' => fake()->dateTimeBetween('-40 days', 'now'),
            ]);
        }
    }
}
