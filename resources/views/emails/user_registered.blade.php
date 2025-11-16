<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Selamat Datang - {{ $appName }}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
<div style="width:100%;padding:24px 0;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.12);">
        <div style="background-color:{{ $primaryColor }};padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td align="left">
                        <div style="font-size:20px;font-weight:700;line-height:1.4;color:#ffffff;">
                            {{ $appName }}
                        </div>
                        <div style="margin-top:4px;font-size:13px;color:rgba(241,245,249,0.92);">
                            Platform belajar online untuk upgrade skill kamu.
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
                Terima kasih sudah mendaftar di <strong>{{ $appName }}</strong>. Akun kamu sudah aktif dan siap digunakan untuk belajar.
            </p>
            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:#4b5563;">
                Dari dashboard, kamu dapat:
            </p>
            <ul style="margin:0 0 16px 20px;padding:0;font-size:14px;line-height:1.7;color:#4b5563;">
                <li>Melihat dan mengelola kelas yang kamu ikuti.</li>
                <li>Memantau progres pembelajaran setiap kelas.</li>
                <li>Mengakses sertifikat setelah menyelesaikan kelas.</li>
            </ul>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#4b5563;">
                Klik tombol di bawah ini untuk langsung masuk ke dashboard dan mulai belajar.
            </p>
            <div style="margin:0 0 24px 0;">
                <a href="{{ $dashboardUrl }}"
                   style="display:inline-block;padding:10px 20px;border-radius:999px;background-color:{{ $primaryColor }};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">
                    Masuk ke Dashboard
                </a>
            </div>
        </div>

        <div style="padding:0 24px 24px 24px;border-top:1px solid #e5e7eb;">
            <p style="margin:12px 0 4px 0;font-size:13px;line-height:1.6;color:#6b7280;">
                Jika kamu merasa tidak pernah membuat akun di {{ $appName }}, kamu dapat mengabaikan email ini.
            </p>
            <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                Email ini dikirim otomatis oleh sistem {{ $appName }}. Mohon tidak membalas email ini.
            </p>
        </div>
    </div>
</div>
</body>
</html>

