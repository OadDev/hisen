@component('install.layout', ['step' => 2])
    <h1>Database Connection</h1>
    <p class="lead">Enter the credentials for your MySQL / MariaDB server. We'll test the connection and create the database if it doesn't exist yet.</p>

    @if ($error)
        <div class="alert">{{ $error }}</div>
    @endif

    <form method="POST" action="{{ route('install.database.test') }}">
        @csrf
        <div class="row">
            <div class="field">
                <label for="db_host">Database Host</label>
                <input type="text" id="db_host" name="db_host" value="{{ old('db_host', $old['db_host']) }}" required>
            </div>
            <div class="field">
                <label for="db_port">Port</label>
                <input type="number" id="db_port" name="db_port" value="{{ old('db_port', $old['db_port']) }}" required>
            </div>
        </div>

        <div class="field">
            <label for="db_database">Database Name</label>
            <input type="text" id="db_database" name="db_database" value="{{ old('db_database', $old['db_database']) }}" required>
            <p class="hint">Created automatically if it doesn't already exist.</p>
        </div>

        <div class="row">
            <div class="field">
                <label for="db_username">Database Username</label>
                <input type="text" id="db_username" name="db_username" value="{{ old('db_username', $old['db_username']) }}" required>
            </div>
            <div class="field">
                <label for="db_password">Database Password</label>
                <input type="password" id="db_password" name="db_password" value="{{ old('db_password', $old['db_password'] ?? '') }}">
            </div>
        </div>

        <div class="actions">
            <a class="btn btn-secondary" href="{{ route('install.requirements') }}">Back</a>
            <button type="submit">Test Connection &amp; Continue</button>
        </div>
    </form>
@endcomponent
