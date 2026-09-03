<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            LeadSeeder::class,
            QuotationSeeder::class,
            SalesOrderSeeder::class,
            VendorSeeder::class,
            PurchaseSeeder::class,
            InventorySeeder::class,
            BomSeeder::class,
            ProductionSeeder::class,
            QualitySeeder::class,
            DispatchInstallationSeeder::class,
            ServiceSeeder::class,
            AmcSeeder::class,
            FinanceSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
