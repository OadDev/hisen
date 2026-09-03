# Hisen Machinery ERP — Backend API

Laravel 11 REST API backing the Hisen Machinery ERP frontend. Ships with a
first-run **setup wizard** so a fresh deployment can be configured entirely
from the browser — no manual `.env` editing or `artisan` commands required.

## Quick start

```bash
composer install
php artisan serve
```

Then open **http://localhost:8000** in a browser. Since the app isn't
installed yet, you'll land on `/install`, which walks through:

1. **Requirements check** — PHP version, required extensions, writable paths.
2. **Database connection** — host, port, database name, username, password.
   The database is created automatically if it doesn't exist yet, and the
   connection is tested live before you can continue.
3. **Company & administrator account** — your company name and the Super
   Admin login you'll use afterwards.

Submitting the final step runs the migrations, seeds realistic demo data
across every module (customers, leads, quotations, sales orders, production,
inventory, service, finance, etc.), creates your admin account, and writes
the database credentials to `.env`. A `storage/app/installed.lock` file marks
the app as installed — delete it (and re-run migrations) to reset and go
through the wizard again.

> Note: if you run the app with `php artisan serve` specifically, its
> built-in file watcher restarts the whole process the instant `.env`
> changes. The installer writes `.env` only as its very last step (after
> migrations, seeding, and the admin account already exist), so a restart at
> that point can only ever drop the final redirect — never the install
> itself. A real deployment behind nginx/php-fpm, Octane, etc. doesn't have
> this restart-on-`.env`-change behavior at all.

## Authentication

Email/password auth via [Laravel Sanctum](https://laravel.com/docs/sanctum)
personal access tokens:

- `POST /api/v1/auth/login` → `{ token, user }`
- `POST /api/v1/auth/logout` (Bearer token)
- `GET /api/v1/auth/me` (Bearer token)

## API

All module routes live under `/api/v1/*` and require a Sanctum bearer token
(`Authorization: Bearer <token>`). See `routes/api/modules.php` for the full
list — customers, catalog, CRM leads, quotations, sales orders, production
(work orders, BOM, MRP), purchase (vendors, RFQs, POs, goods receipts),
inventory (warehouses, stock items, transfers), quality (inspections, NCRs),
dispatch & installation, service tickets, spare parts/warranty claims, AMC
contracts, finance (invoices, expenses, payables), users, and audit logs.

Record identifiers mirror the frontend's mock-data conventions (e.g.
`CUS-1000`, `QTN-2400`, `SO-3300`) via a human-readable `code` column, so
most endpoints accept either that code or the numeric primary key in the URL.

## Re-seeding demo data

```bash
php artisan migrate:fresh --seed
```

This drops and rebuilds the whole schema, then repopulates it — useful during
development. It does **not** re-run the setup wizard or touch `.env`; delete
`storage/app/installed.lock` first if you also want the wizard to reappear.
