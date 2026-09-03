<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    private const ROLE_DEPARTMENTS = [
        ['sales_manager', 'Sales', 2],
        ['sales_executive', 'Sales', 8],
        ['production_manager', 'Production', 2],
        ['production_engineer', 'Production', 10],
        ['purchase_manager', 'Purchase', 2],
        ['store_manager', 'Inventory', 3],
        ['quality_manager', 'Quality', 3],
        ['service_manager', 'Service', 2],
        ['field_service_engineer', 'Service', 9],
        ['accounts', 'Finance', 3],
    ];

    public function run(): void
    {
        foreach (self::ROLE_DEPARTMENTS as [$role, $department, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $name = fake()->name();

                User::create([
                    'name' => $name,
                    'email' => fake()->unique()->safeEmail(),
                    'password' => Hash::make('password'),
                    'role' => $role,
                    'department' => $department,
                    'phone' => fake()->phoneNumber(),
                    'active' => fake()->boolean(92),
                ]);
            }
        }
    }
}
