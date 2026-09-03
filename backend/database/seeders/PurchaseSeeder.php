<?php

namespace Database\Seeders;

use App\Models\GoodsReceipt;
use App\Models\PurchaseOrder;
use App\Models\Rfq;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    private const COMPONENTS = ['Servo Motor', 'Ball Screw Assembly', 'Linear Guide Rail', 'PLC Module', 'Spindle Unit', 'Control Panel', 'Steel Plate 10mm', 'Aluminium Extrusion', 'Cooling Fan', 'Cable Harness'];

    public function run(): void
    {
        for ($i = 0; $i < 18; $i++) {
            Rfq::create([
                'code' => 'RFQ-'.(5100 + $i),
                'item' => fake()->randomElement(self::COMPONENTS),
                'quantity' => fake()->numberBetween(10, 300),
                'vendors_invited' => fake()->numberBetween(2, 6),
                'quotes_received' => fake()->numberBetween(0, 6),
                'status' => fake()->randomElement(['open', 'open', 'open', 'closed', 'closed', 'awarded', 'awarded', 'awarded']),
                'due_date' => fake()->dateTimeBetween('now', '+20 days'),
            ]);
        }

        $vendors = Vendor::all();
        $purchaseOrders = [];

        for ($i = 0; $i < 32; $i++) {
            $quantity = fake()->numberBetween(10, 200);
            $unitPrice = fake()->numberBetween(500, 45000);

            $purchaseOrders[] = PurchaseOrder::create([
                'code' => 'PO-'.(4400 + $i),
                'vendor_id' => $vendors->random()->id,
                'item' => fake()->randomElement(self::COMPONENTS),
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_value' => $quantity * $unitPrice,
                'status' => fake()->randomElement(['draft', 'pending', 'pending', 'approved', 'approved', 'dispatched', 'dispatched', 'received', 'received', 'received', 'cancelled']),
                'order_date' => fake()->dateTimeBetween('-1 year', 'now'),
                'expected_delivery' => fake()->dateTimeBetween('now', '+30 days'),
            ]);
        }

        $receivable = array_values(array_filter($purchaseOrders, fn ($po) => in_array($po->status, ['received', 'dispatched'], true)));

        foreach (array_slice($receivable, 0, 20) as $i => $po) {
            GoodsReceipt::create([
                'code' => 'GRN-'.(6600 + $i),
                'purchase_order_id' => $po->id,
                'item' => $po->item,
                'quantity_received' => max(0, $po->quantity - fake()->numberBetween(0, 5)),
                'quantity_ordered' => $po->quantity,
                'received_date' => fake()->dateTimeBetween('-30 days', 'now'),
                'qc_status' => fake()->randomElement(['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'pending', 'pending', 'failed']),
                'warehouse' => fake()->randomElement(['WH-Ahmedabad (Main)', 'WH-Pune', 'WH-Chennai']),
            ]);
        }
    }
}
