<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    private const ACTIONS = [
        ['action' => 'Created', 'entity' => 'Quotation QTN-2451', 'module' => 'Sales'],
        ['action' => 'Approved', 'entity' => 'Purchase Order PO-4482', 'module' => 'Purchase'],
        ['action' => 'Updated', 'entity' => 'Customer Continental Fabricators', 'module' => 'CRM'],
        ['action' => 'Deleted', 'entity' => 'Draft Quotation QTN-2390', 'module' => 'Sales'],
        ['action' => 'Changed status', 'entity' => 'Work Order WO-2214', 'module' => 'Production'],
        ['action' => 'Logged in', 'entity' => 'Session', 'module' => 'System'],
        ['action' => 'Updated permissions for', 'entity' => 'Sales Executive role', 'module' => 'Administration'],
        ['action' => 'Approved', 'entity' => 'Warranty Claim WC-304', 'module' => 'Service'],
        ['action' => 'Exported', 'entity' => 'Finance report (Q2 FY26-27)', 'module' => 'Finance'],
    ];

    public function run(): void
    {
        for ($i = 0; $i < 40; $i++) {
            $entry = fake()->randomElement(self::ACTIONS);
            $timestamp = fake()->dateTimeBetween('-15 days', 'now');

            $log = new AuditLog([
                ...$entry,
                'actor_id' => User::inRandomOrder()->first()?->id,
                'ip_address' => fake()->ipv4(),
            ]);
            $log->created_at = $timestamp;
            $log->updated_at = $timestamp;
            $log->save();
        }
    }
}
