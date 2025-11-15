# Google reCAPTCHA v2 Setup

## Cara Mendapatkan reCAPTCHA Keys

1. **Kunjungi Google reCAPTCHA Admin Console**
   - Buka https://www.google.com/recaptcha/admin
   - Login dengan akun Google Anda

2. **Register a new site**
   - Label: Masukkan nama aplikasi Anda (contoh: "Course LMS")
   - reCAPTCHA type: Pilih **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - Domains: Masukkan domain Anda
     - Untuk development: `localhost` atau `127.0.0.1`
     - Untuk production: domain website Anda (contoh: `courselms.com`)
   - Accept the reCAPTCHA Terms of Service
   - Klik **Submit**

3. **Copy Keys**
   Setelah submit, Anda akan mendapatkan 2 keys:
   - **Site Key** (digunakan di frontend)
   - **Secret Key** (digunakan di backend)

## Konfigurasi di Laravel

1. **Buka file `.env`** dan update nilai berikut:

```env
RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

2. **Restart development server** (jika menggunakan `npm run dev`)

```bash
npm run dev
```

3. **Test Login**
   - Buka http://127.0.0.1:8000/login
   - Anda akan melihat checkbox "I'm not a robot"
   - Centang checkbox sebelum login

## Troubleshooting

### reCAPTCHA tidak muncul?
- Pastikan `RECAPTCHA_SITE_KEY` sudah diset di `.env`
- Pastikan sudah restart vite dev server (`npm run dev`)
- Clear browser cache

### reCAPTCHA error "Invalid site key"?
- Pastikan domain sudah didaftarkan di Google reCAPTCHA admin
- Pastikan menggunakan Site Key yang benar (bukan Secret Key)

### Validasi reCAPTCHA gagal?
- Pastikan `RECAPTCHA_SECRET_KEY` sudah diset di `.env`
- Pastikan menggunakan Secret Key yang benar (bukan Site Key)
- Pastikan checkbox reCAPTCHA sudah dicentang sebelum submit

## Production Deployment

Jangan lupa untuk:
1. Tambahkan production domain ke Google reCAPTCHA admin
2. Update `.env` production dengan keys yang sama (atau buat keys baru khusus production)
3. Run `npm run build` untuk production assets

---

✅ reCAPTCHA v2 sudah terintegrasi dengan halaman login!
