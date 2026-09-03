<?php

namespace App\Http\Controllers\Install;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\EnvironmentWriter;
use App\Support\Installer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\View\View;
use PDO;
use PDOException;
use Throwable;

class InstallController extends Controller
{
    private const REQUIRED_EXTENSIONS = ['pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'curl'];

    public function requirements(): View|RedirectResponse
    {
        if (Installer::isInstalled()) {
            return redirect('/');
        }

        $checks = $this->runRequirementChecks();

        return view('install.requirements', [
            'checks' => $checks,
            'allPassed' => collect($checks)->every(fn ($check) => $check['passed']),
        ]);
    }

    public function showDatabaseForm(): View|RedirectResponse
    {
        if (Installer::isInstalled()) {
            return redirect('/');
        }

        return view('install.database', [
            'old' => session('install.database', [
                'db_host' => '127.0.0.1',
                'db_port' => '3306',
                'db_database' => 'hisen_erp',
                'db_username' => 'hisen',
                'db_password' => '',
            ]),
            'error' => null,
        ]);
    }

    public function testDatabase(Request $request): View|RedirectResponse
    {
        $data = $request->validate([
            'db_host' => ['required', 'string'],
            'db_port' => ['required', 'numeric'],
            'db_database' => ['required', 'string'],
            'db_username' => ['required', 'string'],
            'db_password' => ['nullable', 'string'],
        ]);

        try {
            $dsn = "mysql:host={$data['db_host']};port={$data['db_port']};charset=utf8mb4";
            $pdo = new PDO($dsn, $data['db_username'], $data['db_password'] ?? '', [
                PDO::ATTR_TIMEOUT => 5,
            ]);

            // Create the database if it doesn't already exist.
            $dbName = str_replace('`', '', $data['db_database']);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            return view('install.database', [
                'old' => $data,
                'error' => 'Could not connect to the database: '.$e->getMessage(),
            ]);
        }

        session(['install.database' => $data]);

        return redirect('/install/admin');
    }

    public function showAdminForm(): View|RedirectResponse
    {
        if (Installer::isInstalled()) {
            return redirect('/');
        }

        if (! session('install.database')) {
            return redirect('/install/database');
        }

        return view('install.admin', [
            'old' => session('install.admin', [
                'company_name' => 'Hisen Machinery Pvt. Ltd.',
                'name' => '',
                'email' => '',
            ]),
        ]);
    }

    public function runInstall(Request $request): View|RedirectResponse
    {
        if (Installer::isInstalled()) {
            return redirect('/');
        }

        $dbConfig = session('install.database');

        if (! $dbConfig) {
            return redirect('/install/database');
        }

        $validator = Validator::make($request->all(), [
            'company_name' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            session(['install.admin' => $request->only('company_name', 'name', 'email')]);

            return view('install.admin', [
                'old' => $request->only('company_name', 'name', 'email'),
                'errors' => $validator->errors(),
            ]);
        }

        $admin = $validator->validated();

        try {
            // Connect to the target database in-memory first (without touching
            // .env yet) so all the real work — migrations, seeding, and the
            // admin account — completes before we persist anything to disk.
            // Some ways of running this app (e.g. `php artisan serve`) restart
            // the whole process the instant .env changes, which would abort
            // an in-flight request; writing .env last means that restart can
            // only ever cost the final redirect, never the installation itself.
            $this->reconnectDatabase($dbConfig);

            Artisan::call('migrate:fresh', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);

            $user = User::where('email', $admin['email'])->first();

            if ($user) {
                $user->update([
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                    'role' => 'super_admin',
                ]);
            } else {
                User::create([
                    'name' => $admin['name'],
                    'email' => $admin['email'],
                    'password' => Hash::make($admin['password']),
                    'role' => 'super_admin',
                    'department' => 'Management',
                ]);
            }

            Installer::markInstalled();
            $this->writeEnvironment($dbConfig, $admin['company_name']);
            $request->session()->forget(['install.database', 'install.admin']);
        } catch (Throwable $e) {
            return view('install.admin', [
                'old' => $request->only('company_name', 'name', 'email'),
                'errors' => collect(['install' => 'Installation failed: '.$e->getMessage()]),
            ]);
        }

        return redirect('/install/complete');
    }

    public function complete(): View
    {
        return view('install.complete');
    }

    /**
     * @return array<int, array{label: string, passed: bool, hint: string}>
     */
    private function runRequirementChecks(): array
    {
        $checks = [
            [
                'label' => 'PHP version 8.2 or higher',
                'passed' => version_compare(PHP_VERSION, '8.2.0', '>='),
                'hint' => 'Current version: '.PHP_VERSION,
            ],
        ];

        foreach (self::REQUIRED_EXTENSIONS as $extension) {
            $checks[] = [
                'label' => "PHP extension: {$extension}",
                'passed' => extension_loaded($extension),
                'hint' => extension_loaded($extension) ? 'Enabled' : 'Missing — enable this extension in php.ini',
            ];
        }

        $writablePaths = [
            'storage/' => storage_path(),
            'bootstrap/cache/' => base_path('bootstrap/cache'),
            '.env' => base_path('.env'),
        ];

        foreach ($writablePaths as $label => $path) {
            $checks[] = [
                'label' => "Writable: {$label}",
                'passed' => is_writable($path),
                'hint' => is_writable($path) ? 'Writable' : 'Not writable — check file permissions',
            ];
        }

        return $checks;
    }

    /**
     * @param  array<string, string>  $dbConfig
     */
    private function writeEnvironment(array $dbConfig, string $companyName): void
    {
        if (! config('app.key') || str_contains((string) config('app.key'), 'base64:0000')) {
            Artisan::call('key:generate', ['--force' => true]);
        }

        EnvironmentWriter::update([
            'APP_NAME' => $companyName,
            'DB_CONNECTION' => 'mysql',
            'DB_HOST' => $dbConfig['db_host'],
            'DB_PORT' => $dbConfig['db_port'],
            'DB_DATABASE' => $dbConfig['db_database'],
            'DB_USERNAME' => $dbConfig['db_username'],
            'DB_PASSWORD' => $dbConfig['db_password'] ?? '',
            'SESSION_DRIVER' => 'database',
            'CACHE_STORE' => 'database',
            'QUEUE_CONNECTION' => 'database',
        ]);
    }

    /**
     * @param  array<string, string>  $dbConfig
     */
    private function reconnectDatabase(array $dbConfig): void
    {
        config([
            'database.default' => 'mysql',
            'database.connections.mysql.host' => $dbConfig['db_host'],
            'database.connections.mysql.port' => $dbConfig['db_port'],
            'database.connections.mysql.database' => $dbConfig['db_database'],
            'database.connections.mysql.username' => $dbConfig['db_username'],
            'database.connections.mysql.password' => $dbConfig['db_password'] ?? '',
        ]);

        \DB::purge('mysql');
        \DB::setDefaultConnection('mysql');
    }
}
