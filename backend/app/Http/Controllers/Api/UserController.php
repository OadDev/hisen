<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($role = $request->string('role')->toString()) {
            $query->where('role', $role);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }

        return UserResource::collection($query->orderBy('name')->paginate($request->integer('per_page', 50)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', Password::min(8)],
            'role' => ['required', 'in:'.implode(',', User::ROLES)],
            'department' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        AuditLog::record('Created', "User {$user->name}", 'Administration', $request->user()?->id);

        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:190'],
            'role' => ['sometimes', 'in:'.implode(',', User::ROLES)],
            'department' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'active' => ['nullable', 'boolean'],
        ]);

        $user->update($data);

        AuditLog::record('Updated', "User {$user->name}", 'Administration', $request->user()?->id);

        return new UserResource($user);
    }

    public function destroy(Request $request, User $user)
    {
        AuditLog::record('Deactivated', "User {$user->name}", 'Administration', $request->user()?->id);

        $user->update(['active' => false]);

        return response()->json(status: 204);
    }
}
