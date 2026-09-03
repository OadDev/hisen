@component('install.layout', ['step' => 1])
    <h1>Welcome</h1>
    <p class="lead">Before we begin, let's make sure your server meets the requirements to run Hisen Machinery ERP.</p>

    <ul class="check-list">
        @foreach ($checks as $check)
            <li>
                @if ($check['passed'])
                    <svg class="icon ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
                @else
                    <svg class="icon fail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
                @endif
                <span>{{ $check['label'] }}</span>
                <span class="badge {{ $check['passed'] ? 'ok' : 'fail' }}">{{ $check['hint'] }}</span>
            </li>
        @endforeach
    </ul>

    <div class="actions">
        <a class="btn" href="{{ route('install.requirements') }}" style="background:transparent;color:var(--text);border:1px solid var(--border);">Re-check</a>
        @if ($allPassed)
            <a class="btn" href="{{ route('install.database') }}">Continue</a>
        @else
            <button disabled>Resolve issues above to continue</button>
        @endif
    </div>
@endcomponent
