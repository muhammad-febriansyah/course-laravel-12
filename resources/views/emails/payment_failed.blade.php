<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Pembayaran Tidak Berhasil - {{ $appName }}</title>
</head>
<body style="margin:0;padding:0;background-color:#fef2f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
<div style="width:100%;padding:24px 0;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(185,28,28,0.12);">
        <div style="background-color:{{ $primaryColor }};padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td align="left">
                        <div style="font-size:20px;font-weight:700;line-height:1.4;color:#ffffff;">
                            {{ $appName }}
                        </div>
                        <div style="margin-top:4px;font-size:13px;color:rgba(254,242,242,0.96);">
                            Pembayaran kamu belum berhasil diproses.
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div style="padding:24px 24px 8px 24px;">
            <h1 style="margin:0 0 12px 0;font-size:20px;line-height:1.4;color:#0f172a;">
                Halo {{ $user->name }},
            </h1>
            <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#4b5563;">
                Status pembayaran untuk transaksi berikut adalah <strong>{{ $statusLabel }}</strong>.
            </p>

            <div style="margin:16px 0 20px 0;padding:12px 14px;border-radius:10px;background-color:#fef2f2;border:1px solid #fecaca;">
                <div style="font-size:13px;font-weight:600;color:#b91c1c;margin-bottom:4px;">
                    Keterangan
                </div>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#7f1d1d;">
                    {{ $reason }}
                </p>
            </div>

            <div style="margin:20px 0;padding:16px 16px 14px 16px;border-radius:10px;background-color:#f9fafb;border:1px solid #e5e7eb;">
                <div style="font-size:13px;font-weight:600;color:#6b7280;margin-bottom:8px;">
                    Ringkasan Transaksi
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px;color:#111827;">
                    <tr>
                        <td style="padding:4px 0;color:#6b7280;width:120px;">Invoice</td>
                        <td style="padding:4px 0;font-weight:500;">{{ $invoice }}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#6b7280;">Kelas</td>
                        <td style="padding:4px 0;font-weight:500;">
                            {{ $kelas?->title ?? '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#6b7280;">Total</td>
                        <td style="padding:4px 0;font-weight:600;color:#111827;">
                            Rp {{ $totalFormatted }}
                        </td>
                    </tr>
                </table>
            </div>

            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:#4b5563;">
                Kamu tetap bisa mencoba ulang pembayaran kapan saja dengan melakukan checkout kembali pada kelas yang sama.
            </p>

            <div style="margin:0 0 24px 0;">
                <a href="{{ $ctaUrl }}"
                   style="display:inline-block;padding:10px 20px;border-radius:999px;background-color:{{ $primaryColor }};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">
                    {{ $ctaLabel }}
                </a>
            </div>
        </div>

        <div style="padding:0 24px 24px 24px;border-top:1px solid #fee2e2;">
            <p style="margin:12px 0 4px 0;font-size:13px;line-height:1.6;color:#6b7280;">
                Jika kamu merasa ada kesalahan pada status ini, hubungi tim dukungan {{ $appName }} dengan menyertakan nomor invoice di atas.
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                Email ini dikirim otomatis oleh sistem {{ $appName }}. Mohon tidak membalas email ini.
            </p>
        </div>
    </div>
</div>
</body>
</html>

