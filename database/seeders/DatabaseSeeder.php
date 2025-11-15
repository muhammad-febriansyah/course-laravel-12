<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin',
                'password' => 'admin123',
                'email_verified_at' => now(),
                'role' => 'admin',
                'status' => 1,
            ]
        );

        // Mentor demo user
        User::firstOrCreate(
            ['email' => 'mentor@mentor.com'],
            [
                'name' => 'Mentor Demo',
                'password' => 'mentor123',
                'email_verified_at' => now(),
                'role' => 'mentor',
                'status' => 1,
            ]
        );

        $this->call([
            MenuSeeder::class,
            SettingSeeder::class,
            VisiMisiSeeder::class,
            TermConditionSeeder::class,
            KebijakanPrivasiSeeder::class,
            CategorySeeder::class,
            LevelSeeder::class,
            TypeSeeder::class,
            BenefitSeeder::class,
            FaqSeeder::class,
            PromoCodeSeeder::class,
            KelasSeeder::class,
            ReviewSeeder::class, // Add review seeder after KelasSeeder
            MentorCourseDummySeeder::class,
            SectionVideoSeeder::class,
            TransactionSeeder::class,
            EnrollmentSeeder::class,
            NewsCategorySeeder::class,
            NewsSeeder::class,
            QuizSeeder::class,
        ]);
    }
}
