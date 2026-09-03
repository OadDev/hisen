<?php

namespace Database\Seeders;

use App\Models\Quotation;
use App\Models\SalesOrder;
use App\Models\User;
use Database\Seeders\Concerns\CreatesWithTimestamp;
use Illuminate\Database\Seeder;

class SalesOrderSeeder extends Seeder
{
    use CreatesWithTimestamp;

    public function run(): void
    {
        $eligible = Quotation::whereIn('status', ['won', 'approved'])->with('lineItems')->get();

        if ($eligible->isEmpty()) {
            $eligible = Quotation::with('lineItems')->get();
        }

        for ($i = 0; $i < 38; $i++) {
            $quotation = $eligible[$i % $eligible->count()];
            $total = $quotation->lineItems->sum(fn ($item) => $item->quantity * $item->unit_price * (1 - $item->discount_pct / 100));
            $total = round($total * (1 - $quotation->discount_pct / 100) * (1 + $quotation->tax_pct / 100), 2);

            $status = fake()->randomElement(['pending', 'pending', 'in-progress', 'in-progress', 'production', 'production', 'production', 'dispatched', 'dispatched', 'installed', 'installed', 'completed', 'completed', 'completed', 'cancelled']);
            $orderDate = fake()->dateTimeBetween('-1 year', 'now');
            $advancePct = fake()->randomElement([0.3, 0.4, 0.5]);

            $this->createAt(SalesOrder::class, [
                'code' => 'SO-'.(3300 + $i),
                'quotation_id' => $quotation->id,
                'customer_id' => $quotation->customer_id,
                'owner_id' => User::randomOfRole('sales_executive')?->id,
                'status' => $status,
                'payment_status' => fake()->randomElement(['pending', 'partially-paid', 'partially-paid', 'partially-paid', 'paid', 'paid', 'paid', 'paid', 'overdue']),
                'order_value' => $total,
                'advance_paid' => round($total * $advancePct, 2),
                'currency' => $quotation->currency,
                'order_date' => $orderDate,
                'expected_dispatch' => (clone $orderDate)->modify('+'.fake()->numberBetween(25, 70).' days'),
                'production_progress' => fake()->numberBetween(0, 100),
            ], $orderDate);
        }
    }
}
