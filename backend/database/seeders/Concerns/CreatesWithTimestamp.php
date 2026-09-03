<?php

namespace Database\Seeders\Concerns;

trait CreatesWithTimestamp
{
    /**
     * Create a model with fillable attributes plus an explicit created_at/updated_at,
     * bypassing mass-assignment protection for the timestamp columns.
     */
    protected function createAt(string $modelClass, array $attributes, $timestamp)
    {
        $model = new $modelClass($attributes);
        $model->created_at = $timestamp;
        $model->updated_at = $timestamp;
        $model->save();

        return $model;
    }
}
