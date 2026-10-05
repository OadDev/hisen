<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 28px 36px; }
        body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #1a1a1a; }
        .header { width: 100%; margin-bottom: 18px; }
        .header td { vertical-align: top; }
        .brand { font-size: 20px; font-weight: bold; color: #1e3a8a; }
        .tagline { font-size: 10px; color: #666; margin-top: 2px; }
        .doc-title { font-size: 16px; font-weight: bold; text-align: right; }
        .doc-meta { text-align: right; color: #444; margin-top: 4px; }
        .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 4px; }
        .box { border: 1px solid #ddd; border-radius: 4px; padding: 10px 12px; margin-bottom: 16px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        table.items th { background: #f1f5f9; text-align: left; padding: 7px 8px; font-size: 10px; text-transform: uppercase; color: #555; border-bottom: 1px solid #ddd; }
        table.items td { padding: 7px 8px; border-bottom: 1px solid #eee; font-size: 11px; }
        table.items td.num, table.items th.num { text-align: right; }
        table.totals { width: 260px; margin-left: auto; border-collapse: collapse; }
        table.totals td { padding: 4px 0; font-size: 11px; }
        table.totals td.label { color: #666; }
        table.totals td.num { text-align: right; }
        table.totals tr.total td { border-top: 1.5px solid #1a1a1a; font-size: 13px; font-weight: bold; padding-top: 8px; }
        .footer-note { margin-top: 24px; font-size: 9.5px; color: #888; }
        .watermark { position: fixed; top: 300px; left: 60px; font-size: 72px; color: #000; opacity: 0.06; transform: rotate(-30deg); z-index: -1; }
    </style>
</head>
<body>
    @if($quotation->watermark)
        <div class="watermark">HISEN MACHINERY</div>
    @endif

    <table class="header">
        <tr>
            <td>
                <div class="brand">Hisen Machinery</div>
                <div class="tagline">Enterprise ERP &middot; Industrial Machinery Manufacturing</div>
            </td>
            <td>
                <div class="doc-title">QUOTATION</div>
                <div class="doc-meta">
                    {{ $quotation->code }}<br>
                    Issued {{ $quotation->created_at->format('d M Y') }}<br>
                    @if($quotation->valid_until)
                        Valid until {{ \Illuminate\Support\Carbon::parse($quotation->valid_until)->format('d M Y') }}
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <div class="box">
        <div class="section-title">Prepared For</div>
        <strong>{{ $quotation->customer->name ?? 'Unknown customer' }}</strong><br>
        {{ $quotation->customer->industry ?? '' }}
        @if($headOffice)
            <br>{{ $headOffice->address }}, {{ $headOffice->city }}, {{ $headOffice->state }}, {{ $headOffice->country }}
        @endif
        @if($quotation->customer->gstin ?? false)
            <br>GSTIN: {{ $quotation->customer->gstin }}
        @endif
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Item</th>
                <th class="num">Qty</th>
                <th class="num">Unit Price</th>
                <th class="num">Discount</th>
                <th class="num">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quotation->lineItems as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="num">{{ $item->quantity }}</td>
                    <td class="num">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="num">{{ number_format($item->discount_pct, 2) }}%</td>
                    <td class="num">{{ number_format($item->quantity * $item->unit_price * (1 - $item->discount_pct / 100), 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="label">Subtotal</td>
            <td class="num">{{ $quotation->currency }} {{ number_format($subtotal, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Discount ({{ number_format($quotation->discount_pct, 2) }}%)</td>
            <td class="num">-{{ $quotation->currency }} {{ number_format($subtotal - $afterDiscount, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Tax ({{ number_format($quotation->tax_pct, 2) }}%)</td>
            <td class="num">{{ $quotation->currency }} {{ number_format($tax, 2) }}</td>
        </tr>
        <tr class="total">
            <td class="label">Total</td>
            <td class="num">{{ $quotation->currency }} {{ number_format($total, 2) }}</td>
        </tr>
    </table>

    <div class="footer-note">
        Prepared by {{ $quotation->owner->name ?? 'Hisen Machinery Sales Team' }}. Prices are indicative and subject to confirmation at order placement.
        This quotation is valid until the date stated above unless otherwise agreed in writing.
    </div>
</body>
</html>
