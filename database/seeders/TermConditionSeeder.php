<?php

namespace Database\Seeders;

use App\Models\TermCondition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TermConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TermCondition::create([
            'title' => 'Syarat dan Ketentuan',
            'body' => '<h2>Syarat dan Ketentuan Penggunaan Platform Kursus Online</h2>

<p>Selamat datang di platform kursus online kami. Dengan mengakses dan menggunakan layanan kami, Anda setuju untuk mematuhi syarat dan ketentuan berikut:</p>

<h3>1. Pendaftaran dan Akun</h3>
<ul>
    <li>Pengguna wajib memberikan informasi yang akurat dan lengkap saat mendaftar</li>
    <li>Setiap pengguna bertanggung jawab untuk menjaga kerahasiaan akun dan password</li>
    <li>Pengguna dilarang berbagi akses akun dengan pihak lain</li>
    <li>Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan</li>
</ul>

<h3>2. Hak Akses Kursus</h3>
<ul>
    <li>Akses kursus diberikan sesuai dengan paket yang dibeli</li>
    <li>Konten kursus dilindungi hak cipta dan hanya untuk penggunaan pribadi</li>
    <li>Pengguna dilarang mengunduh, mendistribusikan, atau memperbanyak materi kursus tanpa izin</li>
    <li>Masa akses kursus sesuai dengan ketentuan yang berlaku pada setiap paket</li>
</ul>

<h3>3. Pembayaran dan Pengembalian Dana</h3>
<ul>
    <li>Pembayaran dilakukan sesuai dengan metode yang tersedia di platform</li>
    <li>Harga kursus dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
    <li>Pengembalian dana dapat dilakukan dalam waktu 7 hari setelah pembelian dengan syarat dan ketentuan berlaku</li>
    <li>Kode promo memiliki masa berlaku dan ketentuan penggunaan tertentu</li>
</ul>

<h3>4. Kewajiban Pengguna</h3>
<ul>
    <li>Pengguna wajib menggunakan platform dengan etika yang baik</li>
    <li>Dilarang melakukan tindakan yang dapat merugikan platform atau pengguna lain</li>
    <li>Dilarang menyebarkan konten yang melanggar hukum, pornografi, atau SARA</li>
    <li>Pengguna bertanggung jawab penuh atas semua aktivitas di akun mereka</li>
</ul>

<h3>5. Hak Kekayaan Intelektual</h3>
<ul>
    <li>Seluruh konten di platform ini merupakan hak milik kami atau mitra kami</li>
    <li>Pengguna dilarang menggunakan logo, merek, atau konten kami tanpa izin tertulis</li>
    <li>Pelanggaran hak cipta akan ditindak sesuai hukum yang berlaku</li>
</ul>

<h3>6. Batasan Tanggung Jawab</h3>
<ul>
    <li>Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan platform</li>
    <li>Kami tidak menjamin hasil tertentu dari pembelajaran di platform</li>
    <li>Ketersediaan platform dapat berubah sewaktu-waktu untuk pemeliharaan atau perbaikan</li>
</ul>

<h3>7. Perubahan Syarat dan Ketentuan</h3>
<p>Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform dan pengguna dianggap menyetujui perubahan tersebut dengan tetap menggunakan layanan kami.</p>

<h3>8. Hukum yang Berlaku</h3>
<p>Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia.</p>

<p><strong>Terakhir diperbarui: Oktober 2025</strong></p>'
        ]);
    }
}
