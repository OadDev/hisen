<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerBranch;
use App\Models\CustomerContact;
use App\Models\InstalledMachine;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    private const INDUSTRIES = ['Automotive Components', 'Sheet Metal Fabrication', 'Furniture Manufacturing', 'Aerospace Parts', 'Signage & Advertising', 'General Engineering', 'Electronics Enclosures', 'Packaging Machinery'];

    private const CITIES = [
        ['Ahmedabad', 'Gujarat', 'India'],
        ['Pune', 'Maharashtra', 'India'],
        ['Coimbatore', 'Tamil Nadu', 'India'],
        ['Rajkot', 'Gujarat', 'India'],
        ['Ludhiana', 'Punjab', 'India'],
        ['Dubai', 'Dubai', 'UAE'],
        ['Riyadh', 'Riyadh', 'Saudi Arabia'],
        ['Lagos', 'Lagos', 'Nigeria'],
        ['Nairobi', 'Nairobi', 'Kenya'],
        ['Jakarta', 'Jakarta', 'Indonesia'],
    ];

    public function run(): void
    {
        $machines = Product::where('category', 'Machines')->get();

        for ($i = 0; $i < 48; $i++) {
            $name = trim(preg_replace('/,?\s*(LLC|Inc\.?|Ltd\.?|Group)$/i', '', fake()->company())).' '.fake()->randomElement(['Industries', 'Engineering Works', 'Manufacturing', 'Machine Tools', 'Fabricators', 'Pvt. Ltd.']);
            $currency = fake()->randomElement(['INR', 'INR', 'INR', 'INR', 'INR', 'INR', 'INR', 'USD', 'USD', 'USD']);

            $customer = Customer::create([
                'code' => 'CUS-'.(1000 + $i),
                'name' => $name,
                'industry' => fake()->randomElement(self::INDUSTRIES),
                'gstin' => fake()->numberBetween(10, 36).'ABCDE'.fake()->numberBetween(1000, 9999).'F1Z'.fake()->numberBetween(1, 9),
                'pan_number' => 'ABCDE'.fake()->numberBetween(1000, 9999).'F',
                'currency' => $currency,
                'credit_limit' => fake()->numberBetween(100000, 5000000),
                'credit_days' => fake()->randomElement([0, 15, 30, 45, 60]),
                'account_owner_id' => User::randomOfRole('sales_executive')?->id,
                'status' => fake()->randomElement(['active', 'active', 'active', 'active', 'active', 'active', 'active', 'prospect', 'prospect', 'inactive']),
                'tags' => fake()->randomElements(['Key Account', 'Export', 'AMC Customer', 'High Value', 'New'], fake()->numberBetween(0, 2)),
                'lifetime_value' => fake()->numberBetween(200000, 42000000),
            ]);

            $branchCount = fake()->numberBetween(1, 3);
            for ($b = 0; $b < $branchCount; $b++) {
                [$city, $state, $country] = fake()->randomElement(self::CITIES);

                CustomerBranch::create([
                    'customer_id' => $customer->id,
                    'name' => $b === 0 ? "{$name} - Head Office" : "{$name} - {$city} Branch",
                    'city' => $city,
                    'state' => $state,
                    'country' => $country,
                    'address' => fake()->streetAddress(),
                    'is_head_office' => $b === 0,
                ]);
            }

            $contactCount = fake()->numberBetween(1, 4);
            for ($c = 0; $c < $contactCount; $c++) {
                $contactName = fake()->name();

                CustomerContact::create([
                    'customer_id' => $customer->id,
                    'name' => $contactName,
                    'designation' => fake()->randomElement(['Procurement Manager', 'Plant Head', 'Managing Director', 'Production Manager', 'Purchase Executive']),
                    'email' => fake()->unique()->safeEmail(),
                    'phone' => fake()->phoneNumber(),
                    'is_primary' => $c === 0,
                ]);
            }

            $machineCount = fake()->numberBetween(0, 5);
            for ($m = 0; $m < $machineCount; $m++) {
                $installedOn = fake()->dateTimeBetween('-4 years', 'now');
                $warrantyEnds = (clone $installedOn)->modify('+'.fake()->randomElement([12, 18, 24]).' months');

                InstalledMachine::create([
                    'customer_id' => $customer->id,
                    'product_name' => $machines->random()->name,
                    'serial_number' => 'HSN-'.fake()->unique()->numerify('########'),
                    'installed_on' => $installedOn,
                    'warranty_ends_on' => $warrantyEnds,
                    'amc_active' => fake()->boolean(55),
                    'status' => fake()->randomElement(['operational', 'operational', 'operational', 'operational', 'operational', 'operational', 'operational', 'operational', 'under-service', 'decommissioned']),
                ]);
            }
        }
    }
}
