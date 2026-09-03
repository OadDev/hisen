<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationLineItem;
use App\Models\QuotationVersion;
use App\Models\User;
use Database\Seeders\Concerns\CreatesWithTimestamp;
use Illuminate\Database\Seeder;

class QuotationSeeder extends Seeder
{
    use CreatesWithTimestamp;

    private const NOTES = ['Revised pricing after negotiation', 'Added extraction accessory', 'Updated payment terms', 'Applied special discount'];

    public function run(): void
    {
        $customers = Customer::all();
        $machines = Product::where('category', 'Machines')->get();

        for ($i = 0; $i < 42; $i++) {
            $customer = $customers->random();
            $owner = User::randomOfRole('sales_executive');
            $status = fake()->randomElement(['draft', 'draft', 'pending', 'pending', 'pending', 'approved', 'approved', 'won', 'won', 'lost', 'rejected']);
            $createdAt = fake()->dateTimeBetween('-1 year', 'now');

            $quotation = $this->createAt(Quotation::class, [
                'code' => 'QTN-'.(2400 + $i),
                'customer_id' => $customer->id,
                'owner_id' => $owner?->id,
                'status' => $status,
                'currency' => $customer->currency,
                'valid_until' => (clone $createdAt)->modify('+30 days'),
                'discount_pct' => fake()->randomElement([0, 3, 5, 7]),
                'tax_pct' => 18,
            ], $createdAt);

            $lineItemCount = fake()->numberBetween(1, 3);
            for ($l = 0; $l < $lineItemCount; $l++) {
                $machine = $machines->random();

                QuotationLineItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $machine->id,
                    'product_name' => $machine->name,
                    'quantity' => fake()->numberBetween(1, 3),
                    'unit_price' => $machine->price,
                    'discount_pct' => fake()->randomElement([0, 2, 5, 8, 10]),
                ]);
            }

            $versionCount = fake()->numberBetween(1, 3);
            for ($v = 0; $v < $versionCount; $v++) {
                $this->createAt(QuotationVersion::class, [
                    'quotation_id' => $quotation->id,
                    'version' => $v + 1,
                    'updated_by' => $owner?->id,
                    'note' => $v === 0 ? 'Initial quotation created' : fake()->randomElement(self::NOTES),
                ], fake()->dateTimeBetween($createdAt, 'now'));
            }
        }
    }
}
