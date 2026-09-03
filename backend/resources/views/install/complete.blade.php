@component('install.layout', ['step' => 4])
    <div class="success-box">
        <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h1>Installation Complete</h1>
        <p class="lead">Hisen Machinery ERP has been installed with realistic demo data across every module.<br>You can now sign in with the administrator account you just created.</p>
        <a class="btn" href="{{ config('app.frontend_url', '/') }}">Continue to Sign In</a>
    </div>
@endcomponent
