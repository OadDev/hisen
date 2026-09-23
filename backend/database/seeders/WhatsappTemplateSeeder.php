<?php

namespace Database\Seeders;

use App\Models\WhatsappTemplate;
use Illuminate\Database\Seeder;

class WhatsappTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Follow-up after quotation',
                'body' => "Hi {{contact_name}}, following up on the quotation we shared for {{product_name}}. Happy to answer any questions or arrange a call this week.",
            ],
            [
                'name' => 'On hold acknowledgement',
                'body' => "Hi {{contact_name}}, I understand things might be on hold due to factory construction. Whenever you're ready to resume, we're here to help.",
            ],
            [
                'name' => 'New product range announcement',
                'body' => "Hisen has expanded the product range with modular machines built for faster changeovers. Let us know if you'd like a spec sheet for your line.",
            ],
        ];

        foreach ($templates as $template) {
            WhatsappTemplate::create($template);
        }
    }
}
