<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $news = [
            [
                'category_id' => 1, // Teknologi Pembelajaran
                'title' => 'Revolusi AI dalam Dunia Pendidikan Online',
                'slug' => 'revolusi-ai-dalam-dunia-pendidikan-online',
                'desc' => 'Artificial Intelligence kini mengubah cara kita belajar secara online dengan personalisasi pembelajaran yang lebih efektif.',
                'body' => '<p>Teknologi Artificial Intelligence (AI) telah membawa perubahan besar dalam dunia pendidikan online. Dengan kemampuan untuk menganalisis pola belajar siswa, AI dapat memberikan rekomendasi materi yang disesuaikan dengan kebutuhan masing-masing individu.</p><p>Platform pembelajaran online kini dilengkapi dengan chatbot cerdas yang dapat menjawab pertanyaan siswa 24/7, sistem penilaian otomatis yang lebih akurat, dan analitik pembelajaran yang membantu instruktur memahami progress setiap siswa.</p><p>Ke depannya, AI diprediksi akan semakin terintegrasi dalam setiap aspek pembelajaran online, mulai dari konten adaptif hingga virtual tutor yang dapat berinteraksi layaknya guru sungguhan.</p>',
                'image' => 'news/ai-education.jpg',
                'status' => 1,
                'views' => 1250,
            ],
            [
                'category_id' => 2, // Tips & Trik Belajar
                'title' => '7 Teknik Pomodoro untuk Meningkatkan Produktivitas Belajar',
                'slug' => '7-teknik-pomodoro-untuk-meningkatkan-produktivitas-belajar',
                'desc' => 'Pelajari teknik Pomodoro yang terbukti efektif meningkatkan fokus dan produktivitas saat belajar online.',
                'body' => '<p>Teknik Pomodoro adalah metode manajemen waktu yang dikembangkan oleh Francesco Cirillo pada akhir 1980-an. Teknik ini sangat efektif untuk meningkatkan fokus dan produktivitas, terutama saat belajar online.</p><p>Cara kerja teknik Pomodoro cukup sederhana: belajar fokus selama 25 menit, lalu istirahat 5 menit. Setelah 4 siklus Pomodoro, ambil istirahat lebih panjang sekitar 15-30 menit.</p><p>Tips menggunakan Pomodoro: 1) Matikan semua notifikasi, 2) Siapkan materi sebelum memulai, 3) Gunakan timer, 4) Catat progress, 5) Jangan skip istirahat, 6) Sesuaikan durasi dengan kebutuhan, 7) Kombinasikan dengan teknik belajar lain.</p>',
                'image' => 'news/pomodoro-technique.jpg',
                'status' => 1,
                'views' => 2100,
            ],
            [
                'category_id' => 3, // Karir & Pengembangan
                'title' => 'Skill Digital Marketing yang Wajib Dikuasai di 2025',
                'slug' => 'skill-digital-marketing-yang-wajib-dikuasai-di-2025',
                'desc' => 'Ketahui skill digital marketing apa saja yang paling dicari perusahaan dan bagaimana cara mempelajarinya.',
                'body' => '<p>Industri digital marketing terus berkembang pesat. Di tahun 2025, ada beberapa skill yang wajib dikuasai untuk tetap kompetitif di bidang ini.</p><p>Pertama, SEO dan SEM masih menjadi fondasi penting. Kemampuan mengoptimasi website untuk mesin pencari dan mengelola iklan berbayar tetap sangat dibutuhkan. Kedua, content marketing dan storytelling menjadi kunci untuk membangun engagement dengan audience.</p><p>Skill lain yang tak kalah penting: data analytics untuk mengukur performa campaign, social media marketing, email marketing automation, video marketing, influencer marketing, dan pemahaman tentang AI tools untuk marketing.</p><p>Kabar baiknya, semua skill ini bisa dipelajari melalui kursus online dengan biaya terjangkau dan fleksibilitas waktu yang tinggi.</p>',
                'image' => 'news/digital-marketing-skills.jpg',
                'status' => 1,
                'views' => 3450,
            ],
            [
                'category_id' => 1, // Teknologi Pembelajaran
                'title' => 'Metaverse: Masa Depan Pembelajaran Immersive',
                'slug' => 'metaverse-masa-depan-pembelajaran-immersive',
                'desc' => 'Bagaimana teknologi Metaverse akan mengubah pengalaman belajar online menjadi lebih interaktif dan immersive.',
                'body' => '<p>Metaverse bukan hanya tentang gaming dan social media. Teknologi ini membawa potensi besar untuk dunia pendidikan, menciptakan pengalaman belajar yang belum pernah ada sebelumnya.</p><p>Bayangkan bisa mengikuti kelas di ruang virtual 3D, berinteraksi dengan objek pembelajaran secara langsung, atau melakukan eksperimen sains di laboratorium virtual yang aman. Semua ini menjadi mungkin dengan Metaverse.</p><p>Beberapa universitas dan platform edukasi sudah mulai bereksperimen dengan pembelajaran di Metaverse. Hasilnya menunjukkan peningkatan engagement dan pemahaman materi yang signifikan.</p><p>Meski masih dalam tahap awal, Metaverse diprediksi akan menjadi standar baru dalam pembelajaran online dalam 5-10 tahun ke depan.</p>',
                'image' => 'news/metaverse-education.jpg',
                'status' => 1,
                'views' => 1890,
            ],
            [
                'category_id' => 2, // Tips & Trik Belajar
                'title' => 'Cara Efektif Membuat Catatan Digital untuk Pembelajaran Online',
                'slug' => 'cara-efektif-membuat-catatan-digital-untuk-pembelajaran-online',
                'desc' => 'Pelajari teknik note-taking digital yang efektif menggunakan berbagai tools modern.',
                'body' => '<p>Membuat catatan yang baik adalah kunci kesuksesan dalam pembelajaran online. Dengan tools digital modern, proses note-taking bisa jauh lebih efisien dan terorganisir.</p><p>Beberapa metode note-taking yang populer: Cornell Method untuk struktur catatan yang sistematis, Mind Mapping untuk memvisualisasikan konsep kompleks, dan Zettelkasten untuk membangun knowledge base jangka panjang.</p><p>Tools yang direkomendasikan: Notion untuk all-in-one workspace, Obsidian untuk knowledge management, Evernote untuk catatan cepat, dan OneNote untuk integrasi dengan Microsoft ecosystem.</p><p>Tips penting: gunakan formatting yang konsisten, tambahkan tag untuk memudahkan pencarian, sertakan screenshot dan diagram, dan review catatan secara berkala.</p>',
                'image' => 'news/digital-note-taking.jpg',
                'status' => 1,
                'views' => 1650,
            ],
            [
                'category_id' => 4, // Berita Pendidikan
                'title' => 'Pemerintah Luncurkan Program Beasiswa Online Course untuk 10,000 Pelajar',
                'slug' => 'pemerintah-luncurkan-program-beasiswa-online-course',
                'desc' => 'Komitmen pemerintah meningkatkan skill digital masyarakat melalui program beasiswa kursus online gratis.',
                'body' => '<p>Kementerian Pendidikan mengumumkan peluncuran program beasiswa online course yang akan menguntungkan 10,000 pelajar dan fresh graduate di seluruh Indonesia.</p><p>Program ini mencakup berbagai bidang seperti programming, digital marketing, data science, UI/UX design, dan business management. Peserta akan mendapatkan akses gratis ke platform pembelajaran online terkemuka selama 6 bulan.</p><p>Direktur Jenderal Pendidikan Vokasi menyatakan, "Program ini adalah bagian dari upaya kita mempersiapkan talenta digital Indonesia yang kompetitif di era industri 4.0. Kami berharap lulusan program ini dapat langsung terserap di industri atau memulai usaha sendiri."</p><p>Pendaftaran dibuka mulai bulan depan melalui portal resmi Kemendikbud. Seleksi dilakukan berdasarkan motivasi, rencana karir, dan komitmen untuk menyelesaikan program.</p>',
                'image' => 'news/scholarship-program.jpg',
                'status' => 1,
                'views' => 4200,
            ],
            [
                'category_id' => 5, // Inspirasi & Motivasi
                'title' => 'Kisah Sukses: Dari Karyawan Biasa Menjadi Full-Stack Developer dalam 1 Tahun',
                'slug' => 'kisah-sukses-dari-karyawan-biasa-menjadi-fullstack-developer',
                'desc' => 'Inspirasi dari Budi yang berhasil switch career menjadi developer hanya dengan belajar online course.',
                'body' => '<p>Budi Santoso, 28 tahun, adalah bukti nyata bahwa tidak ada kata terlambat untuk belajar skill baru. Setahun yang lalu, ia masih bekerja sebagai admin di sebuah perusahaan retail dengan gaji UMR.</p><p>"Saya selalu tertarik dengan teknologi tapi merasa sudah terlambat untuk mulai. Sampai saya menemukan platform online course yang mengubah hidup saya," ujar Budi.</p><p>Budi mulai belajar programming dari nol setiap malam setelah pulang kerja. Ia mengikuti bootcamp online selama 6 bulan, fokus pada JavaScript, React, dan Node.js. Tantangan terbesar adalah mengatur waktu dan mempertahankan motivasi.</p><p>"Kuncinya adalah konsistensi. Saya belajar minimal 2 jam setiap hari, tidak peduli seberapa lelah. Dan saya bergabung dengan komunitas online untuk saling support," tambahnya.</p><p>Kini Budi bekerja sebagai Full-Stack Developer di startup teknologi dengan gaji 3x lipat dari pekerjaan sebelumnya. Ia juga aktif membagikan pengalamannya untuk menginspirasi orang lain.</p>',
                'image' => 'news/success-story-budi.jpg',
                'status' => 1,
                'views' => 5670,
            ],
            [
                'category_id' => 3, // Karir & Pengembangan
                'title' => 'Profesi Data Scientist: Panduan Lengkap Memulai Karir',
                'slug' => 'profesi-data-scientist-panduan-lengkap-memulai-karir',
                'desc' => 'Roadmap lengkap untuk memulai karir sebagai Data Scientist dari nol hingga siap kerja.',
                'body' => '<p>Data Scientist sering disebut sebagai "profesi terseksi abad 21" dengan alasan yang kuat. Permintaan tinggi, gaji kompetitif, dan kesempatan kerja remote membuat profesi ini sangat menarik.</p><p>Untuk menjadi Data Scientist, ada beberapa skill fundamental yang harus dikuasai: Python atau R programming, statistics dan probability, machine learning algorithms, data visualization, dan SQL untuk database management.</p><p>Roadmap yang direkomendasikan: 1) Pelajari dasar programming (2-3 bulan), 2) Kuasai statistics dan matematika (2-3 bulan), 3) Belajar machine learning (3-4 bulan), 4) Praktik dengan real-world projects (ongoing), 5) Build portfolio di GitHub, 6) Networking dan apply kerja.</p><p>Total waktu yang dibutuhkan sekitar 8-12 bulan belajar intensif. Banyak bootcamp online menawarkan program terstruktur dengan mentor guidance, sangat cocok untuk pemula yang ingin belajar lebih cepat.</p>',
                'image' => 'news/data-scientist-career.jpg',
                'status' => 1,
                'views' => 2890,
            ],
            [
                'category_id' => 4, // Berita Pendidikan
                'title' => 'Riset: Pembelajaran Online Sama Efektifnya dengan Tatap Muka',
                'slug' => 'riset-pembelajaran-online-sama-efektifnya-dengan-tatap-muka',
                'desc' => 'Studi terbaru menunjukkan bahwa pembelajaran online dapat sama efektif atau bahkan lebih baik dalam beberapa aspek.',
                'body' => '<p>Sebuah studi meta-analisis yang dilakukan oleh konsorsium universitas internasional mengungkapkan hasil mengejutkan: pembelajaran online dapat sama efektifnya dengan pembelajaran tatap muka tradisional.</p><p>Penelitian yang menganalisis data dari lebih dari 50,000 siswa di berbagai negara ini menemukan bahwa tidak ada perbedaan signifikan dalam hasil pembelajaran antara kedua metode tersebut. Bahkan dalam beberapa kasus, pembelajaran online menunjukkan hasil yang lebih baik.</p><p>Faktor kunci yang menentukan efektivitas pembelajaran online adalah: kualitas konten, interaksi dengan instruktur, engagement dengan sesama siswa, dan self-discipline pelajar.</p><p>Dr. Sarah Johnson, lead researcher, menjelaskan, "Yang penting bukan mediumnya, tapi bagaimana pembelajaran dirancang. Online learning yang well-designed dengan interaksi yang baik bisa sangat efektif, bahkan memberikan fleksibilitas yang tidak dimiliki pembelajaran tradisional."</p><p>Hasil riset ini diharapkan dapat menghilangkan stigma bahwa pembelajaran online inferior dibanding tatap muka.</p>',
                'image' => 'news/online-learning-research.jpg',
                'status' => 1,
                'views' => 3120,
            ],
            [
                'category_id' => 5, // Inspirasi & Motivasi
                'title' => 'Growth Mindset: Rahasia Sukses Belajar Online',
                'slug' => 'growth-mindset-rahasia-sukses-belajar-online',
                'desc' => 'Mengapa mindset adalah faktor terpenting dalam kesuksesan pembelajaran online dan bagaimana mengembangkannya.',
                'body' => '<p>Carol Dweck, psikolog Stanford, menemukan bahwa mindset adalah faktor paling menentukan kesuksesan seseorang. Konsep "Growth Mindset" sangat relevan untuk pembelajaran online.</p><p>Growth Mindset adalah kepercayaan bahwa kemampuan dan kecerdasan dapat dikembangkan melalui dedikasi dan kerja keras. Berbeda dengan Fixed Mindset yang percaya bahwa talenta adalah bawaan dan tidak bisa diubah.</p><p>Dalam konteks belajar online, Growth Mindset membantu kita: 1) Melihat kesalahan sebagai kesempatan belajar, 2) Terus berusaha meski menghadapi tantangan, 3) Terinspirasi oleh kesuksesan orang lain, 4) Menerima feedback dengan terbuka, 5) Fokus pada proses, bukan hanya hasil.</p><p>Cara mengembangkan Growth Mindset: ubah self-talk negatif ("Saya tidak bisa") menjadi positif ("Saya belum bisa, tapi saya akan terus belajar"), rayakan small wins, dan kelilingi diri dengan orang-orang yang supportif.</p><p>Ingat, setiap expert pernah menjadi pemula. Yang membedakan mereka yang sukses adalah mindset dan konsistensi dalam belajar.</p>',
                'image' => 'news/growth-mindset.jpg',
                'status' => 1,
                'views' => 2340,
            ],
        ];

        foreach ($news as $item) {
            \App\Models\News::firstOrCreate(
                ['slug' => $item['slug']],
                $item
            );
        }
    }
}
