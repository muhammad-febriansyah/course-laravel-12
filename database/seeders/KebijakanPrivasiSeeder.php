<?php

namespace Database\Seeders;

use App\Models\KebijakanPrivasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KebijakanPrivasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KebijakanPrivasi::create([
            'title' => 'Kebijakan Privasi',
            'body' => '<h2>Kebijakan Privasi Platform Kursus Online</h2>

<p>Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.</p>

<h3>1. Informasi yang Kami Kumpulkan</h3>
<p>Kami mengumpulkan berbagai jenis informasi untuk memberikan layanan terbaik kepada Anda:</p>
<ul>
    <li><strong>Informasi Pribadi:</strong> Nama, email, nomor telepon, dan alamat</li>
    <li><strong>Informasi Akun:</strong> Username, password (terenkripsi), dan preferensi pembelajaran</li>
    <li><strong>Informasi Pembayaran:</strong> Detail transaksi (kami tidak menyimpan informasi kartu kredit)</li>
    <li><strong>Informasi Penggunaan:</strong> Riwayat kursus, progress pembelajaran, dan aktivitas di platform</li>
    <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, dan perangkat yang digunakan</li>
</ul>

<h3>2. Cara Kami Menggunakan Informasi Anda</h3>
<p>Informasi yang kami kumpulkan digunakan untuk:</p>
<ul>
    <li>Menyediakan dan mengelola akses ke kursus online</li>
    <li>Memproses pembayaran dan transaksi</li>
    <li>Mengirimkan notifikasi terkait kursus dan update platform</li>
    <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
    <li>Mencegah aktivitas penipuan dan menjaga keamanan platform</li>
    <li>Mengirimkan newsletter dan promosi (dengan persetujuan Anda)</li>
    <li>Analisis data untuk pengembangan fitur baru</li>
</ul>

<h3>3. Berbagi Informasi dengan Pihak Ketiga</h3>
<p>Kami tidak menjual data pribadi Anda. Kami hanya berbagi informasi dengan:</p>
<ul>
    <li><strong>Penyedia Layanan Payment Gateway:</strong> Untuk memproses pembayaran</li>
    <li><strong>Cloud Service Provider:</strong> Untuk hosting dan penyimpanan data</li>
    <li><strong>Email Service Provider:</strong> Untuk mengirim notifikasi dan newsletter</li>
    <li><strong>Analytics Service:</strong> Untuk menganalisis penggunaan platform (data anonim)</li>
    <li><strong>Otoritas Hukum:</strong> Jika diwajibkan oleh hukum atau untuk melindungi hak kami</li>
</ul>

<h3>4. Keamanan Data</h3>
<p>Kami menerapkan berbagai langkah keamanan untuk melindungi data Anda:</p>
<ul>
    <li>Enkripsi data sensitif menggunakan SSL/TLS</li>
    <li>Password dienkripsi menggunakan algoritma hashing yang aman</li>
    <li>Akses ke data dibatasi hanya untuk staf yang berwenang</li>
    <li>Backup data secara berkala</li>
    <li>Monitoring keamanan 24/7</li>
</ul>

<h3>5. Hak Pengguna</h3>
<p>Anda memiliki hak untuk:</p>
<ul>
    <li><strong>Mengakses Data:</strong> Meminta salinan data pribadi Anda</li>
    <li><strong>Memperbaiki Data:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat</li>
    <li><strong>Menghapus Data:</strong> Meminta penghapusan akun dan data pribadi Anda</li>
    <li><strong>Membatasi Pemrosesan:</strong> Meminta pembatasan penggunaan data tertentu</li>
    <li><strong>Portabilitas Data:</strong> Mendapatkan data dalam format yang dapat dipindahkan</li>
    <li><strong>Menolak Marketing:</strong> Berhenti berlangganan email promosi kapan saja</li>
</ul>

<h3>6. Cookie dan Teknologi Pelacakan</h3>
<p>Kami menggunakan cookie dan teknologi serupa untuk:</p>
<ul>
    <li>Menjaga sesi login Anda</li>
    <li>Mengingat preferensi Anda</li>
    <li>Menganalisis penggunaan platform</li>
    <li>Menampilkan konten yang relevan</li>
</ul>
<p>Anda dapat mengatur browser untuk menolak cookie, namun ini dapat mempengaruhi fungsionalitas platform.</p>

<h3>7. Privasi Anak-anak</h3>
<p>Platform kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak secara sengaja mengumpulkan data dari anak-anak di bawah umur tanpa izin orang tua.</p>

<h3>8. Penyimpanan Data</h3>
<p>Kami menyimpan data Anda selama akun Anda aktif atau sesuai dengan kebutuhan layanan. Data akan dihapus setelah:</p>
<ul>
    <li>Anda menghapus akun</li>
    <li>Periode retensi yang diwajibkan hukum berakhir</li>
    <li>Data tidak lagi diperlukan untuk tujuan yang dikumpulkan</li>
</ul>

<h3>9. Perubahan Kebijakan Privasi</h3>
<p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan material akan diinformasikan melalui email atau notifikasi di platform.</p>

<h3>10. Hubungi Kami</h3>
<p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda, silakan hubungi kami melalui:</p>
<ul>
    <li>Email: privacy@platformkursus.com</li>
    <li>Telepon: +62 21 1234 5678</li>
    <li>Alamat: Jakarta, Indonesia</li>
</ul>

<p><strong>Terakhir diperbarui: Oktober 2025</strong></p>'
        ]);
    }
}
