<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\WhatsappTemplate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class WhatsappTemplateController extends Controller
{
    use CrudsSimpleResource;

    protected function modelClass(): string
    {
        return WhatsappTemplate::class;
    }

    protected function searchable(): array
    {
        return ['name'];
    }

    protected function auditModule(): string
    {
        return 'WhatsApp';
    }

    protected function auditLabel(Model $model): string
    {
        return "WhatsApp template \"{$model->name}\"";
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'name' => [$required, 'string', 'max:190'],
            'body' => [$required, 'string', 'max:1000'],
        ];
    }

    public function index(Request $request)
    {
        return WhatsappTemplate::query()->orderByDesc('id')->get();
    }
}
