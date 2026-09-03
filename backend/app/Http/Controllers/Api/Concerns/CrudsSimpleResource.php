<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Shared index/show/store/update/destroy implementation for the simpler,
 * flat ERP modules that don't need bespoke API Resources. Subclasses
 * declare the model class, validation rules, and searchable columns.
 */
trait CrudsSimpleResource
{
    abstract protected function modelClass(): string;

    abstract protected function rules(bool $isUpdate): array;

    protected function with(): array
    {
        return [];
    }

    protected function searchable(): array
    {
        return [];
    }

    protected function auditLabel(Model $model): string
    {
        return class_basename($model).' #'.($model->code ?? $model->id);
    }

    protected function auditModule(): string
    {
        return class_basename($this->modelClass());
    }

    public function index(Request $request)
    {
        $modelClass = $this->modelClass();
        $query = $modelClass::query();

        if ($this->with()) {
            $query->with($this->with());
        }

        if (($search = $request->string('search')->toString()) && $this->searchable()) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchable() as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('id')->paginate($request->integer('per_page', 25));
    }

    public function show(string $id)
    {
        $modelClass = $this->modelClass();
        $query = $modelClass::query();

        if ($this->with()) {
            $query->with($this->with());
        }

        return $this->resolveRecord($query, $id);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $modelClass = $this->modelClass();
        $model = $modelClass::create($data);

        AuditLog::record('Created', $this->auditLabel($model), $this->auditModule(), $request->user()?->id);

        return response()->json($model->fresh($this->with()), 201);
    }

    public function update(Request $request, string $id)
    {
        $modelClass = $this->modelClass();
        $model = $this->resolveRecord($modelClass::query(), $id);
        $data = $request->validate($this->rules(true));
        $model->update($data);

        AuditLog::record('Updated', $this->auditLabel($model), $this->auditModule(), $request->user()?->id);

        return $model->fresh($this->with());
    }

    public function destroy(Request $request, string $id)
    {
        $modelClass = $this->modelClass();
        $model = $this->resolveRecord($modelClass::query(), $id);

        AuditLog::record('Deleted', $this->auditLabel($model), $this->auditModule(), $request->user()?->id);

        $model->delete();

        return response()->json(status: 204);
    }

    private function resolveRecord($query, string $id)
    {
        return is_numeric($id)
            ? $query->findOrFail($id)
            : $query->where('code', $id)->firstOrFail();
    }
}
