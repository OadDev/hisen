<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    use GeneratesCode;

    public function index(Request $request)
    {
        $query = Lead::query()->with('owner');

        if ($source = $request->string('source')->toString()) {
            $query->where('source', $source);
        }

        if ($stage = $request->string('stage')->toString()) {
            $query->where('stage', $stage);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('company', 'like', "%{$search}%")->orWhere('contact_name', 'like', "%{$search}%");
            });
        }

        return $query->orderByDesc('id')->paginate($request->integer('per_page', 25));
    }

    public function show(string $code)
    {
        return Lead::where('code', $code)->with(['owner', 'activities.actor'])->firstOrFail();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company' => ['required', 'string'],
            'contact_name' => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'source' => ['required', 'in:Website,WhatsApp,Trade Show,Alibaba,Made-in-China,Email,Referral,Sales Executive'],
            'interested_product' => ['nullable', 'string'],
            'estimated_value' => ['nullable', 'numeric'],
            'owner_id' => ['nullable', 'exists:users,id'],
        ]);

        $data['code'] = self::nextCode(Lead::class, 'LD', 2000);
        $data['stage'] = 'Lead';

        $lead = Lead::create($data);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'type' => 'note',
            'title' => 'Lead created',
            'actor_id' => $request->user()?->id,
            'occurred_at' => now(),
        ]);

        AuditLog::record('Created', "Lead {$lead->company}", 'CRM', $request->user()?->id);

        return response()->json($lead, 201);
    }

    public function update(Request $request, string $code)
    {
        $lead = Lead::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'stage' => ['sometimes', 'in:Lead,Discussion,Technical Proposal,Quotation,Negotiation,Advance,Won,Lost'],
            'estimated_value' => ['nullable', 'numeric'],
            'owner_id' => ['nullable', 'exists:users,id'],
            'lost_reason' => ['nullable', 'string'],
            'next_follow_up' => ['nullable', 'date'],
        ]);

        $stageChanged = isset($data['stage']) && $data['stage'] !== $lead->stage;

        $lead->update($data);

        if ($stageChanged) {
            LeadActivity::create([
                'lead_id' => $lead->id,
                'type' => 'stage-change',
                'title' => "Stage moved to {$lead->stage}",
                'actor_id' => $request->user()?->id,
                'occurred_at' => now(),
            ]);
        }

        return $lead->fresh(['owner', 'activities']);
    }

    public function addActivity(Request $request, string $code)
    {
        $lead = Lead::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'type' => ['required', 'in:call,meeting,email,whatsapp,note'],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $activity = LeadActivity::create([
            ...$data,
            'lead_id' => $lead->id,
            'actor_id' => $request->user()?->id,
            'occurred_at' => now(),
        ]);

        return response()->json($activity->load('actor'), 201);
    }
}
