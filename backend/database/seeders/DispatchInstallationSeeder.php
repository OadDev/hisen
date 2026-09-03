<?php

namespace Database\Seeders;

use App\Models\Installation;
use App\Models\SalesOrder;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Database\Seeder;

class DispatchInstallationSeeder extends Seeder
{
    public function run(): void
    {
        $orders = SalesOrder::whereIn('status', ['dispatched', 'installed', 'completed'])
            ->with('customer.branches')
            ->get();

        if ($orders->isEmpty()) {
            $orders = SalesOrder::with('customer.branches')->get();
        }

        $shipments = [];

        foreach ($orders->take(24) as $i => $order) {
            $customer = $order->customer;
            $branch = $customer?->branches->first();
            $isExport = $customer?->currency === 'USD';

            $shipments[] = Shipment::create([
                'code' => 'SHP-'.(8800 + $i),
                'sales_order_id' => $order->id,
                'destination' => $branch ? "{$branch->city}, {$branch->country}" : 'Unknown',
                'container_no' => $isExport ? 'MSCU'.fake()->numerify('#######') : null,
                'mode' => $isExport ? fake()->randomElement(['sea', 'air']) : 'road',
                'status' => fake()->randomElement(['packing', 'packing', 'ready', 'ready', 'in-transit', 'in-transit', 'delivered', 'delivered', 'delivered', 'delivered']),
                'dispatch_date' => fake()->dateTimeBetween('-25 days', 'now'),
                'eta' => fake()->dateTimeBetween('now', '+15 days'),
                'export_docs_ready' => fake()->boolean(70),
            ]);
        }

        foreach (array_slice($shipments, 0, 16) as $i => $shipment) {
            $status = fake()->randomElement(['scheduled', 'scheduled', 'in-progress', 'in-progress', 'completed', 'completed', 'completed', 'completed', 'completed']);
            $checklistTotal = 12;

            Installation::create([
                'code' => 'INS-'.(900 + $i),
                'sales_order_id' => $shipment->sales_order_id,
                'engineer_id' => User::randomOfRole('field_service_engineer')?->id,
                'scheduled_date' => fake()->dateTimeBetween('now', '+25 days'),
                'status' => $status,
                'checklist_done' => $status === 'completed' ? $checklistTotal : ($status === 'in-progress' ? fake()->numberBetween(3, 10) : 0),
                'checklist_total' => $checklistTotal,
                'customer_signed' => $status === 'completed',
                'training_completed' => $status === 'completed' ? fake()->boolean(85) : false,
            ]);
        }
    }
}
