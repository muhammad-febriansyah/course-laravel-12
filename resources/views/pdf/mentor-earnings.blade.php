<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pendapatan Mentor</title>
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
        .header .site-name {
            font-size: 14px;
            color: #1F42E0;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 12px;
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
            width: 20%;
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
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            background-color: #dbeafe;
            color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="header">
        <p class="site-name">{{ \App\Models\Setting::first()->site_name ?? 'Platform Kursus' }}</p>
        <h1>Laporan Pendapatan Mentor</h1>
        <p>Dicetak pada: {{ $generated_at }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 25%;">Nama Mentor</th>
                <th style="width: 10%;" class="text-center">Total Kelas</th>
                <th style="width: 10%;" class="text-center">Penjualan</th>
                <th style="width: 15%;" class="text-right">Total Revenue</th>
                <th style="width: 17.5%;" class="text-right">Pendapatan Mentor</th>
                <th style="width: 17.5%;" class="text-right">Fee Platform</th>
            </tr>
        </thead>
        <tbody>
            @foreach($mentors as $index => $mentor)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <div class="font-semibold">{{ $mentor['name'] }}</div>
                    <div style="font-size: 10px; color: #6b7280;">{{ $mentor['email'] }}</div>
                </td>
                <td class="text-center">
                    <span class="badge">{{ $mentor['total_courses'] }}</span>
                </td>
                <td class="text-center">
                    <span class="badge" style="background-color: #dcfce7; color: #166534;">{{ $mentor['total_sales'] }}</span>
                </td>
                <td class="text-right font-semibold">
                    Rp {{ number_format($mentor['total_revenue'], 0, ',', '.') }}
                </td>
                <td class="text-right font-semibold text-primary">
                    Rp {{ number_format($mentor['mentor_earnings'], 0, ',', '.') }}
                </td>
                <td class="text-right font-semibold text-amber">
                    Rp {{ number_format($mentor['platform_fees'], 0, ',', '.') }}
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
