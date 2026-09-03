<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Payable;
use App\Models\SalesOrder;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    private const EXPENSE_CATEGORIES = ['Travel', 'Site Visit', 'Office Supplies', 'Utilities', 'Marketing', 'Logistics', 'Training'];

    public function run(): void
    {
        $orders = SalesOrder::with('customer')->get();

        foreach ($orders as $i => $order) {
            $dueDate = (clone $order->order_date)->modify('+30 days');
            $overdue = $dueDate < now() && $order->payment_status !== 'paid';

            Invoice::create([
                'code' => 'INV-'.(3300 + $i),
                'sales_order_id' => $order->id,
                'customer_name' => $order->customer?->name ?? 'Unknown',
                'amount' => $order->order_value,
                'amount_paid' => $order->payment_status === 'paid' ? $order->order_value : $order->advance_paid,
                'currency' => $order->currency,
                'issued_date' => $order->order_date,
                'due_date' => $dueDate,
                'status' => $overdue ? 'overdue' : $order->payment_status,
            ]);
        }

        for ($i = 0; $i < 30; $i++) {
            Expense::create([
                'code' => 'EXP-'.(900 + $i),
                'category' => fake()->randomElement(self::EXPENSE_CATEGORIES),
                'description' => fake()->sentence(6),
                'amount' => fake()->numberBetween(1200, 85000),
                'expense_date' => fake()->dateTimeBetween('-40 days', 'now'),
                'status' => fake()->randomElement(['pending', 'pending', 'approved', 'approved', 'approved', 'reimbursed', 'reimbursed', 'reimbursed', 'reimbursed']),
                'submitted_by' => User::inRandomOrder()->first()?->id,
            ]);
        }

        $vendors = Vendor::all();

        for ($i = 0; $i < 20; $i++) {
            $vendor = $vendors->random();

            Payable::create([
                'code' => 'PAY-'.(700 + $i),
                'vendor_id' => $vendor->id,
                'vendor_name' => $vendor->name,
                'amount' => fake()->numberBetween(25000, 1200000),
                'due_date' => fake()->dateTimeBetween('now', '+25 days'),
                'status' => fake()->randomElement(['pending', 'pending', 'pending', 'paid', 'paid', 'paid', 'paid', 'paid', 'overdue']),
            ]);
        }
    }
}
