<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Setup — Hisen Machinery ERP</title>
    <style>
        :root {
            --primary: #1B5FAE;
            --primary-dark: #164c8c;
            --bg: #f5f7fa;
            --card: #ffffff;
            --border: #e2e6ec;
            --text: #1a1f29;
            --muted: #64748b;
            --success: #16a34a;
            --danger: #dc2626;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
        }
        .shell {
            max-width: 720px;
            margin: 0 auto;
            padding: 48px 20px 80px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 32px;
        }
        .brand svg { width: 32px; height: 32px; }
        .brand span { font-weight: 700; font-size: 18px; }
        .steps {
            display: flex;
            gap: 8px;
            margin-bottom: 28px;
        }
        .steps .step {
            flex: 1;
            height: 4px;
            border-radius: 999px;
            background: var(--border);
        }
        .steps .step.done, .steps .step.active { background: var(--primary); }
        .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 32px;
            box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
        }
        h1 { font-size: 22px; margin: 0 0 6px; }
        p.lead { color: var(--muted); margin: 0 0 24px; font-size: 14px; }
        .check-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .check-list li {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px;
        }
        .badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; margin-left: auto; }
        .badge.ok { background: #dcfce7; color: var(--success); }
        .badge.fail { background: #fee2e2; color: var(--danger); }
        .icon { width: 18px; height: 18px; flex-shrink: 0; }
        .icon.ok { color: var(--success); }
        .icon.fail { color: var(--danger); }
        label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
        .field { margin-bottom: 18px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        input[type=text], input[type=email], input[type=password], input[type=number] {
            width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;
            font-size: 14px; outline: none; transition: border-color .15s;
        }
        input:focus { border-color: var(--primary); }
        .hint { font-size: 12px; color: var(--muted); margin-top: 4px; }
        .error { font-size: 12px; color: var(--danger); margin-top: 4px; }
        .alert {
            background: #fef2f2; border: 1px solid #fecaca; color: var(--danger);
            padding: 12px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 20px;
        }
        .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 28px; }
        button, .btn {
            appearance: none; border: none; cursor: pointer;
            background: var(--primary); color: #fff; font-weight: 600; font-size: 14px;
            padding: 11px 22px; border-radius: 9px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
            transition: background .15s;
        }
        button:hover, .btn:hover { background: var(--primary-dark); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary { background: transparent; color: var(--text); border: 1px solid var(--border); }
        .btn-secondary:hover { background: #f1f3f6; }
        .success-box { text-align: center; padding: 24px 0; }
        .success-icon {
            width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: var(--success);
            display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }
        code { background: #f1f3f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
<div class="shell">
    <div class="brand">
        <svg viewBox="0 0 100 100" fill="none">
            <defs><clipPath id="badge"><path d="M50 3L90 24V63L74 80L50 97L26 80L10 63V24L50 3Z"/></clipPath></defs>
            <g clip-path="url(#badge)">
                <rect width="100" height="100" fill="#1B5FAE"/>
                <polygon points="38,0 62,0 40,100 16,100" fill="#fff"/>
            </g>
        </svg>
        <span>Hisen Machinery ERP — Setup</span>
    </div>

    <div class="steps">
        <div class="step {{ $step >= 1 ? 'done' : '' }} {{ $step === 1 ? 'active' : '' }}"></div>
        <div class="step {{ $step >= 2 ? 'done' : '' }} {{ $step === 2 ? 'active' : '' }}"></div>
        <div class="step {{ $step >= 3 ? 'done' : '' }} {{ $step === 3 ? 'active' : '' }}"></div>
        <div class="step {{ $step >= 4 ? 'done' : '' }} {{ $step === 4 ? 'active' : '' }}"></div>
    </div>

    <div class="card">
        {{ $slot }}
    </div>
</div>
</body>
</html>
