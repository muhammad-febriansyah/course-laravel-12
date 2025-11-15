<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedMenu([
            'name' => 'dashboard',
            'title' => 'Beranda',
            'url' => '/admin/dashboard',
            'icon' => 'dashboard',
            'order' => 1,
        ]);

        $this->seedMenu([
            'name' => 'users',
            'title' => 'Pengguna',
            'url' => '/admin/users',
            'icon' => 'people',
            'order' => 2,
        ]);

        $this->seedMenu([
            'name' => 'features',
            'title' => 'Features',
            'url' => '/admin/features',
            'icon' => 'sparkles',
            'order' => 3,
        ]);

        $courses = $this->seedMenu([
            'name' => 'courses',
            'title' => 'Manajemen Kursus',
            'icon' => 'school',
            'order' => 4,
        ]);

        $this->seedMenu([
            'name' => 'kelas',
            'title' => 'Kelas',
            'url' => '/admin/kelas',
            'icon' => 'class',
            'order' => 1,
        ], $courses);

        $this->seedMenu([
            'name' => 'categories',
            'title' => 'Kategori',
            'url' => '/admin/categories',
            'icon' => 'category',
            'order' => 2,
        ], $courses);

        $this->seedMenu([
            'name' => 'levels',
            'title' => 'Tingkat Kesulitan',
            'url' => '/admin/levels',
            'icon' => 'trending_up',
            'order' => 3,
        ], $courses);

        $this->seedMenu([
            'name' => 'types',
            'title' => 'Tipe Kelas',
            'url' => '/admin/types',
            'icon' => 'label',
            'order' => 4,
        ], $courses);

        $content = $this->seedMenu([
            'name' => 'content',
            'title' => 'Manajemen Konten',
            'icon' => 'library_books',
            'order' => 5,
            'is_active' => false,
        ]);

        $this->seedMenu([
            'name' => 'sections',
            'title' => 'Bagian Materi',
            'url' => '/sections',
            'icon' => 'list',
            'order' => 1,
        ], $content);

        $this->seedMenu([
            'name' => 'videos',
            'title' => 'Video',
            'url' => '/videos',
            'icon' => 'play_circle',
            'order' => 2,
        ], $content);

        $this->seedMenu([
            'name' => 'quizzes',
            'title' => 'Kuis',
            'url' => '/quizzes',
            'icon' => 'quiz',
            'order' => 3,
        ], $content);

        $marketing = $this->seedMenu([
            'name' => 'marketing',
            'title' => 'Pemasaran',
            'icon' => 'campaign',
            'order' => 6,
        ]);

        $this->seedMenu([
            'name' => 'promo_codes',
            'title' => 'Kode Promo',
            'url' => '/admin/promo-codes',
            'icon' => 'local_offer',
            'order' => 1,
        ], $marketing);

        $this->seedMenu([
            'name' => 'benefits',
            'title' => 'Benefit',
            'url' => '/admin/benefits',
            'icon' => 'card_giftcard',
            'order' => 2,
        ], $marketing);

        $news = $this->seedMenu([
            'name' => 'news',
            'title' => 'Blog',
            'icon' => 'file_text',
            'order' => 7,
        ]);

        $this->seedMenu([
            'name' => 'news_posts',
            'title' => 'Artikel',
            'url' => '/admin/news',
            'icon' => 'file_text',
            'order' => 1,
        ], $news);

        $this->seedMenu([
            'name' => 'news_categories',
            'title' => 'Kategori Blog',
            'url' => '/admin/news-categories',
            'icon' => 'category',
            'order' => 2,
        ], $news);

        $this->seedMenu([
            'name' => 'certificates',
            'title' => 'Sertifikat',
            'url' => '/admin/certificates',
            'icon' => 'award',
            'order' => 8,
        ]);

        $this->seedMenu([
            'name' => 'transactions',
            'title' => 'Transaksi',
            'url' => '/admin/transactions',
            'icon' => 'receipt',
            'order' => 9,
        ]);

        $support = $this->seedMenu([
            'name' => 'support',
            'title' => 'Bantuan',
            'icon' => 'help',
            'order' => 10,
        ]);

        $this->seedMenu([
            'name' => 'faqs',
            'title' => 'Pertanyaan Umum',
            'url' => '/admin/faqs',
            'icon' => 'help_outline',
            'order' => 1,
        ], $support);

        $settings = $this->seedMenu([
            'name' => 'settings',
            'title' => 'Pengaturan',
            'icon' => 'settings',
            'order' => 11,
        ]);

        $this->seedMenu([
            'name' => 'website_settings',
            'title' => 'Pengaturan Website',
            'url' => '/admin/pengaturan',
            'icon' => 'settings_applications',
            'order' => 1,
        ], $settings);

        $this->seedMenu([
            'name' => 'term_conditions',
            'title' => 'Syarat & Ketentuan',
            'url' => '/admin/term-conditions',
            'icon' => 'description',
            'order' => 2,
        ], $settings);

        $this->seedMenu([
            'name' => 'privacy_policy',
            'title' => 'Kebijakan Privasi',
            'url' => '/admin/kebijakan-privasi',
            'icon' => 'shield',
            'order' => 3,
        ], $settings);

        $this->seedMenu([
            'name' => 'about_us',
            'title' => 'Tentang Kami',
            'url' => '/admin/about-us',
            'icon' => 'file_text',
            'order' => 4,
        ], $settings);

        $this->seedMenu([
            'name' => 'visi_misi',
            'title' => 'Visi & Misi',
            'url' => '/admin/visi-misi',
            'icon' => 'target',
            'order' => 5,
        ], $settings);
    }

    protected function seedMenu(array $data, ?Menu $parent = null): Menu
    {
        $existing = Menu::where('name', $data['name'])->first();

        $attributes = [
            'title' => $data['title'],
            'url' => $data['url'] ?? null,
            'icon' => $data['icon'] ?? null,
            'order' => $data['order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
            'parent_id' => $parent?->id,
        ];

        if ($existing) {
            $existing->update($attributes);
            return $existing;
        }

        $menu = new Menu(array_merge(
            [
                'name' => $data['name'],
            ],
            $attributes,
        ));

        $menu->save();

        return $menu;
    }
}
