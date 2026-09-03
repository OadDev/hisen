@component('install.layout', ['step' => 3])
    <h1>Company &amp; Administrator Account</h1>
    <p class="lead">This account will have full Super Admin access to the ERP once setup completes.</p>

    @if (isset($errors) && $errors->count())
        <div class="alert">
            @foreach ($errors->all() as $message)
                <div>{{ $message }}</div>
            @endforeach
        </div>
    @endif

    <form method="POST" action="{{ route('install.admin.submit') }}">
        @csrf
        <div class="field">
            <label for="company_name">Company Name</label>
            <input type="text" id="company_name" name="company_name" value="{{ old('company_name', $old['company_name']) }}" required>
        </div>

        <div class="field">
            <label for="name">Your Full Name</label>
            <input type="text" id="name" name="name" value="{{ old('name', $old['name']) }}" required>
        </div>

        <div class="field">
            <label for="email">Work Email</label>
            <input type="email" id="email" name="email" value="{{ old('email', $old['email']) }}" required>
        </div>

        <div class="row">
            <div class="field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required minlength="8">
            </div>
            <div class="field">
                <label for="password_confirmation">Confirm Password</label>
                <input type="password" id="password_confirmation" name="password_confirmation" required minlength="8">
            </div>
        </div>

        <div class="actions">
            <a class="btn btn-secondary" href="{{ route('install.database') }}">Back</a>
            <button type="submit" id="submit-btn">Install &amp; Create Account</button>
        </div>
    </form>

    <script>
        document.querySelector('form').addEventListener('submit', function () {
            var btn = document.getElementById('submit-btn');
            btn.disabled = true;
            btn.textContent = 'Installing… this may take a minute';
        });
    </script>
@endcomponent
