<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pendapatan {{ $mentor->name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1F42E0;
        }
        .header h1 {
            font-size: 24px;
            color: #1F42E0;
            margin-bottom: 5px;
        }
        .header h2 {
            font-size: 16px;
            color: #333;
            margin-bottom: 3px;
        }
        .header .site-name {
            font-size: 14px;
            color: #1F42E0;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 11px;
            color: #666;
        }
        .summary {
            display: table;
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }
        .summary-row {
            display: table-row;
        }
        .summary-item {
            display: table-cell;
            width: 25%;
            padding: 15px;
            text-align: center;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .summary-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 5px;
            font-weight: 600;
        }
        .summary-value {
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: #1F42E0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #1F42E0;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .font-semibold {
            font-weight: 600;
        }
        .font-mono {
            font-family: 'Courier New', monospace;
        }
        .text-primary {
            color: #1F42E0;
        }
        .text-amber {
            color: #d97706;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <p class="site-name">{{ \App\Models\Setting::first()->site_name ?? 'Platform Kursus' }}</p>
        <h1>Laporan Pendapatan Mentor</h1>
        <h2>{{ $mentor->name }}</h2>
        <p style="margin-top: 3px;">{{ $mentor->email }}</p>
        <p style="margin-top: 10px;">Dicetak pada: {{ $generated_at }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 15%;">Invoice</th>
                <th style="width: 20%;">Kelas</th>
                <th style="width: 15%;">Pembeli</th>
                <th style="width: 13%;" class="text-right">Total</th>
                <th style="width: 13%;" class="text-right">Pendapatan</th>
                <th style="width: 13%;" class="text-right">Fee</th>
                <th style="width: 11%;">Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $index => $transaction)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="font-mono" style="font-size: 10px;">{{ $transaction->invoice_number }}</td>
                <td>
                    <div style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ $transaction->kelas->title }}
                    </div>
                </td>
                <td>{{ $transaction->user->name }}</td>
                <td class="text-right font-semibold">
                    Rp {{ number_format($transaction->total, 0, ',', '.') }}
                </td>
                <td class="text-right font-semibold text-primary">
                    Rp {{ number_format($transaction->mentor_earnings, 0, ',', '.') }}
                </td>
                <td class="text-right font-semibold text-amber">
                    Rp {{ number_format($transaction->platform_fee, 0, ',', '.') }}
                </td>
                <td style="font-size: 10px;">
                    {{ \Carbon\Carbon::parse($transaction->created_at)->format('d M Y') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Laporan ini dicetak secara otomatis oleh sistem</p>
    </div>
</body>
</html>
