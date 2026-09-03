<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    private const MACHINE_LINES = [
        ['name' => 'HM CNC Router Pro', 'sub' => 'CNC Routers'],
        ['name' => 'HM Laser Cutter X2', 'sub' => 'Laser Cutting'],
        ['name' => 'HM Plasma Cutter Edge', 'sub' => 'Plasma Cutting'],
        ['name' => 'HM Fiber Laser Marker', 'sub' => 'Marking Systems'],
        ['name' => 'HM Vertical Machining Center', 'sub' => 'VMC'],
        ['name' => 'HM Hydraulic Press Brake', 'sub' => 'Sheet Metal'],
        ['name' => 'HM Automatic Lathe', 'sub' => 'Turning'],
        ['name' => 'HM Woodworking Router', 'sub' => 'Woodworking'],
    ];

    private const ACCESSORY_LINES = ['Rotary Axis Attachment', 'Auto Tool Changer', 'Water Chiller Unit', 'Dust Extraction System', 'Fume Extractor', 'Vacuum Table', 'Servo Motor Upgrade Kit', 'Rotary Chuck'];

    private const CONSUMABLE_LINES = ['Carbide End Mill Set', 'Cutting Oil (20L)', 'Laser Lens Kit', 'Diamond Cutting Blade', 'Nozzle Assembly Kit', 'Filter Cartridge Pack', 'Coolant Concentrate'];

    private const SPARE_LINES = ['Servo Drive Board', 'Ball Screw Assembly', 'Linear Guide Rail', 'Spindle Motor', 'PLC Control Module', 'Limit Switch Kit', 'Encoder Cable Assembly', 'Power Supply Unit'];

    public function run(): void
    {
        for ($i = 0; $i < 24; $i++) {
            $line = self::MACHINE_LINES[$i % count(self::MACHINE_LINES)];
            $model = $line['name'].' '.fake()->randomElement(['1325', '2030', '1530', '2040', '1218']);

            Product::create([
                'sku' => "HM-MC-".(1000 + $i),
                'name' => $model,
                'category' => 'Machines',
                'sub_category' => $line['sub'],
                'description' => "Industrial-grade {$line['sub']} machine engineered for heavy-duty production environments with high precision and repeatability.",
                'hsn' => '8456',
                'unit' => 'Unit',
                'price' => fake()->numberBetween(450000, 8500000),
                'currency' => 'INR',
                'status' => fake()->randomElement(['active', 'active', 'active', 'active', 'draft', 'discontinued']),
                'specs' => [
                    'Working Area' => fake()->numberBetween(1200, 2500).' x '.fake()->numberBetween(1200, 3000).' mm',
                    'Power' => fake()->numberBetween(5, 40).' kW',
                    'Voltage' => fake()->randomElement(['220V/1P', '380V/3P', '440V/3P']),
                    'Spindle Speed' => fake()->numberBetween(8000, 24000).' RPM',
                    'Max Feed Rate' => fake()->numberBetween(8, 30).' m/min',
                    'Weight' => fake()->numberBetween(800, 6000).' kg',
                ],
                'certifications' => fake()->randomElements(['CE', 'ISO 9001', 'BIS', 'FDA'], fake()->numberBetween(1, 3)),
                'has_video' => fake()->boolean(70),
                'has_pdf_catalog' => true,
                'warranty_months' => fake()->randomElement([12, 18, 24]),
                'lead_time_days' => fake()->numberBetween(20, 75),
            ]);
        }

        $this->seedSimple('Accessories', self::ACCESSORY_LINES, 'AC', 8000, 250000, 18);
        $this->seedSimple('Consumables', self::CONSUMABLE_LINES, 'CN', 500, 15000, 20);
        $this->seedSimple('Spare Parts', self::SPARE_LINES, 'SP', 1200, 95000, 22);
    }

    private function seedSimple(string $category, array $names, string $prefix, int $min, int $max, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $name = $names[$i % count($names)];

            Product::create([
                'sku' => "HM-{$prefix}-".(1000 + $i),
                'name' => trim($name.' '.fake()->randomElement(['Standard', 'Pro', 'Heavy Duty', ''])),
                'category' => $category,
                'sub_category' => $category,
                'description' => fake()->sentence(12),
                'hsn' => fake()->randomElement(['8466', '8207', '3403', '8483']),
                'unit' => fake()->randomElement(['Piece', 'Set', 'Box', 'Litre']),
                'price' => fake()->numberBetween($min, $max),
                'currency' => 'INR',
                'status' => fake()->randomElement(['active', 'active', 'active', 'active', 'discontinued']),
                'specs' => [
                    'Material' => fake()->randomElement(['Carbide', 'HSS', 'Steel Alloy', 'Aluminium', 'Composite']),
                    'Compatibility' => 'Multiple machine models',
                ],
                'certifications' => fake()->randomElements(['ISO 9001', 'RoHS'], fake()->numberBetween(0, 2)),
                'has_video' => false,
                'has_pdf_catalog' => fake()->boolean(50),
                'warranty_months' => fake()->randomElement([0, 3, 6, 12]),
                'lead_time_days' => fake()->numberBetween(2, 20),
            ]);
        }
    }
}
