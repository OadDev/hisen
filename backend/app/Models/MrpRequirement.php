<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MrpRequirement extends Model
{
    protected $fillable = ['component', 'required', 'in_stock', 'on_order', 'unit'];

    public function shortfall(): int
    {
        return max(0, $this->required - $this->in_stock - $this->on_order);
    }
}
