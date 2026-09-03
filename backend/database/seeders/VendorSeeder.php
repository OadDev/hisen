<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    private const CATEGORIES = ['Raw Materials', 'Electrical Components', 'Servo & Motion', 'Machined Parts', 'Consumables', 'Logistics'];

    public function run(): void
    {
        for ($i = 0; $i < 26; $i++) {
            Vendor::create([
                'code' => 'VND-'.(1000 + $i),
                'name' => trim(preg_replace('/,?\s*(LLC|Inc\.?|Ltd\.?)$/i', '', fake()->company())).' '.fake()->randomElement(['Suppliers', 'Industries', 'Components Pvt. Ltd.', 'Trading Co.']),
                'category' => fake()->randomElement(self::CATEGORIES),
                'city' => fake()->city(),
                'country' => fake()->randomElement(['India', 'China', 'Germany', 'Taiwan', 'South Korea']),
                'rating' => fake()->randomFloat(1, 3, 5),
                'on_time_delivery_pct' => fake()->numberBetween(70, 99),
                'quality_score' => fake()->numberBetween(75, 99),
                'lead_time_days' => fake()->numberBetween(5, 45),
                'certifications' => fake()->randomElements(['ISO 9001', 'ISO 14001', 'CE', 'RoHS'], fake()->numberBetween(0, 3)),
                'total_orders' => fake()->numberBetween(5, 120),
                'total_spend' => fake()->numberBetween(200000, 12000000),
                'status' => fake()->randomElement(['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'inactive']),
            ]);
        }
    }
}
