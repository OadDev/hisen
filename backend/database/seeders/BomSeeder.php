<?php

namespace Database\Seeders;

use App\Models\BomComponent;
use App\Models\Product;
use Illuminate\Database\Seeder;

class BomSeeder extends Seeder
{
    private const ASSEMBLIES = [
        'Structural Frame Assembly' => ['Base Frame', 'Gantry Structure', 'Leveling Feet Set'],
        'Motion System' => ['Ball Screw Assembly', 'Linear Guide Rail', 'Servo Motor (X-Axis)', 'Servo Motor (Y-Axis)', 'Servo Motor (Z-Axis)'],
        'Spindle Assembly' => ['Spindle Motor', 'Spindle Bearing Set', 'Tool Holder Chuck'],
        'Electrical & Control' => ['PLC Control Module', 'Control Panel Enclosure', 'Power Supply Unit', 'Cable Harness Kit', 'Emergency Stop Switch'],
        'Cooling & Lubrication' => ['Water Chiller Unit', 'Coolant Pump', 'Lubrication System'],
    ];

    private const SUPPLIERS = ['Precision Bearings Co.', 'Steel Alloy Suppliers', 'Servo Systems Inc.', 'ElectroParts Ltd.', 'In-house Fabrication'];

    public function run(): void
    {
        $machines = Product::where('category', 'Machines')->take(10)->get();

        foreach ($machines as $machine) {
            foreach (self::ASSEMBLIES as $assemblyName => $parts) {
                $assembly = BomComponent::create([
                    'machine_product_id' => $machine->id,
                    'parent_id' => null,
                    'part_no' => 'ASM-'.fake()->numerify('####'),
                    'name' => $assemblyName,
                    'quantity' => 1,
                    'unit' => 'set',
                    'unit_cost' => 0,
                    'supplier' => 'In-house Fabrication',
                ]);

                foreach ($parts as $partName) {
                    BomComponent::create([
                        'machine_product_id' => $machine->id,
                        'parent_id' => $assembly->id,
                        'part_no' => 'PN-'.fake()->numerify('#####'),
                        'name' => $partName,
                        'quantity' => fake()->numberBetween(1, 8),
                        'unit' => 'pcs',
                        'unit_cost' => fake()->numberBetween(250, 45000),
                        'supplier' => fake()->randomElement(self::SUPPLIERS),
                    ]);
                }
            }
        }
    }
}
