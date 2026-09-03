<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockItem;
use App\Models\StockTransfer;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            ['code' => 'WH-01', 'name' => 'WH-Ahmedabad (Main)', 'city' => 'Ahmedabad', 'type' => 'main', 'capacity_pct' => 78, 'bin_locations' => 340],
            ['code' => 'WH-02', 'name' => 'WH-Pune', 'city' => 'Pune', 'type' => 'regional', 'capacity_pct' => 62, 'bin_locations' => 180],
            ['code' => 'WH-03', 'name' => 'WH-Chennai', 'city' => 'Chennai', 'type' => 'regional', 'capacity_pct' => 45, 'bin_locations' => 150],
            ['code' => 'WH-04', 'name' => 'WH-Export Bonded', 'city' => 'Mundra', 'type' => 'bonded', 'capacity_pct' => 88, 'bin_locations' => 90],
        ];

        foreach ($warehouses as $wh) {
            Warehouse::create($wh);
        }

        $warehouseModels = Warehouse::all();
        $products = Product::all();

        $stockItems = [];

        for ($i = 0; $i < 60; $i++) {
            $product = $products[$i % $products->count()];
            $reorderLevel = fake()->numberBetween(5, 60);
            $quantity = fake()->numberBetween(0, $reorderLevel * 4);

            $stockItems[] = StockItem::create([
                'product_id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'category' => $product->category,
                'warehouse_id' => $warehouseModels->random()->id,
                'bin_location' => strtoupper(fake()->randomLetter()).'-'.fake()->numberBetween(1, 24).'-'.fake()->numberBetween(1, 6),
                'quantity' => $quantity,
                'reorder_level' => $reorderLevel,
                'unit' => $product->unit,
                'batch_number' => $product->category === 'Consumables' ? 'BATCH-'.fake()->numerify('######') : null,
                'aging_days' => fake()->numberBetween(1, 380),
                'status' => $quantity === 0 ? 'out_of_stock' : ($quantity < $reorderLevel ? 'low_stock' : 'in_stock'),
            ]);
        }

        for ($i = 0; $i < 14; $i++) {
            [$from, $to] = fake()->randomElements($warehouseModels->all(), 2);

            StockTransfer::create([
                'code' => 'TRF-'.(100 + $i),
                'item' => $stockItems[array_rand($stockItems)]->name,
                'quantity' => fake()->numberBetween(5, 100),
                'from_warehouse_id' => $from->id,
                'to_warehouse_id' => $to->id,
                'status' => fake()->randomElement(['pending', 'pending', 'in-transit', 'in-transit', 'completed', 'completed', 'completed', 'completed']),
                'requested_date' => fake()->dateTimeBetween('-20 days', 'now'),
            ]);
        }
    }
}
