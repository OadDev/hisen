<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MrpRequirement;

class MrpRequirementController extends Controller
{
    public function index()
    {
        return MrpRequirement::all()->map(fn (MrpRequirement $r) => [
            ...$r->toArray(),
            'shortfall' => $r->shortfall(),
        ]);
    }
}
