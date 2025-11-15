<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Bagaimana cara mengakses kursus setelah membeli?',
                'answer' => '<p>Anda dapat mengakses kursus melalui dashboard setelah pembayaran dikonfirmasi dan status pesanan berubah menjadi aktif.</p>',
            ],
            [
                'question' => 'Apakah materi dapat diunduh?',
                'answer' => '<p>Beberapa materi dapat diunduh dalam format PDF atau video, sesuai kebijakan masing-masing instruktur.</p>',
            ],
            [
                'question' => 'Apakah ada sertifikat setelah menyelesaikan kursus?',
                'answer' => '<p>Ya, sertifikat digital akan tersedia di dashboard setelah Anda menyelesaikan seluruh modul dan kuis yang diwajibkan.</p>',
            ],
            [
                'question' => 'Bagaimana jika saya membutuhkan bantuan teknis?',
                'answer' => '<p>Tim support kami siap membantu melalui email <strong>support@example.com</strong> atau WhatsApp di <strong>0812-3456-7890</strong>.</p>',
            ],
            [
                'question' => 'Apakah saya bisa belajar menggunakan perangkat mobile?',
                'answer' => '<p>Tentu. Platform kami responsif dan dapat diakses melalui smartphone, tablet, maupun komputer tanpa instalasi tambahan.</p>',
            ],
            [
                'question' => 'Berapa lama akses kursus tersedia?',
                'answer' => '<p>Akses kursus tersedia seumur hidup sehingga Anda dapat mengulang materi kapan pun dibutuhkan.</p>',
            ],
            [
                'question' => 'Apakah ada sesi live dengan mentor?',
                'answer' => '<p>Beberapa kelas menyediakan sesi live mingguan dengan mentor. Jadwal lengkap tersedia pada halaman detail kelas dan dashboard peserta.</p>',
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                ['answer' => $faq['answer']]
            );
        }
    }
}
