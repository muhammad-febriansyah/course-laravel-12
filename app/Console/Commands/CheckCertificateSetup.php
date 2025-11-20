<?php

namespace App\Console\Commands;

use App\Models\CertificateTemplate;
use Illuminate\Console\Command;

class CheckCertificateSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'certificates:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check certificate system setup and identify potential issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Checking Certificate System Setup...');
        $this->newLine();

        $issues = [];
        $warnings = [];

        // 1. Check storage link
        $this->info('1. Checking storage link...');
        $storageLink = public_path('storage');
        if (is_link($storageLink)) {
            $this->line('   ✓ Storage link exists');
            $target = readlink($storageLink);
            $this->line("   → Points to: {$target}");
        } else {
            $issues[] = 'Storage link does not exist. Run: php artisan storage:link';
            $this->error('   ✗ Storage link not found');
        }
        $this->newLine();

        // 2. Check storage directories
        $this->info('2. Checking storage directories...');
        $directories = [
            storage_path('app/public'),
            storage_path('app/public/certificates'),
            storage_path('app/public/certificates/generated'),
        ];

        foreach ($directories as $dir) {
            if (is_dir($dir)) {
                $writable = is_writable($dir);
                $perms = substr(sprintf('%o', fileperms($dir)), -4);

                if ($writable) {
                    $this->line("   ✓ {$dir}");
                    $this->line("     Permissions: {$perms} (writable)");
                } else {
                    $issues[] = "Directory not writable: {$dir}";
                    $this->error("   ✗ {$dir}");
                    $this->error("     Permissions: {$perms} (not writable)");
                }
            } else {
                $warnings[] = "Directory does not exist (will be created): {$dir}";
                $this->warn("   ! {$dir} does not exist");
            }
        }
        $this->newLine();

        // 3. Check certificate templates
        $this->info('3. Checking certificate templates...');
        $templates = CertificateTemplate::all();

        if ($templates->isEmpty()) {
            $warnings[] = 'No certificate templates found in database';
            $this->warn('   ! No templates found');
        } else {
            $this->line("   Found {$templates->count()} template(s)");

            foreach ($templates as $template) {
                $this->newLine();
                $this->line("   Template #{$template->id}: {$template->name}");
                $this->line("   Status: " . ($template->is_active ? 'Active' : 'Inactive'));
                $this->line("   Path: {$template->background_image}");

                if ($template->background_image) {
                    // Normalize path (remove leading slash)
                    $normalizedPath = ltrim($template->background_image, '/');

                    // Check if path uses old format
                    if (str_starts_with($normalizedPath, 'images/certificates/')) {
                        $issues[] = "Template #{$template->id} uses old path format (images/certificates/)";
                        $this->error("   ✗ Using OLD path format (needs migration)");
                    }

                    // Check if file exists
                    $fullPath = storage_path('app/public/' . $normalizedPath);
                    if (file_exists($fullPath)) {
                        $size = filesize($fullPath);
                        $this->line("   ✓ File exists (" . round($size / 1024, 2) . " KB)");
                    } else {
                        $issues[] = "Template #{$template->id} background file not found: {$fullPath}";
                        $this->error("   ✗ File NOT found at: {$fullPath}");
                    }
                } else {
                    $warnings[] = "Template #{$template->id} has no background image";
                    $this->warn("   ! No background image set");
                }
            }
        }
        $this->newLine();

        // 4. Check FPDI library
        $this->info('4. Checking PDF library (FPDI)...');
        if (class_exists(\setasign\Fpdi\Fpdi::class)) {
            $this->line('   ✓ FPDI library installed');
        } else {
            $issues[] = 'FPDI library not found. Run: composer require setasign/fpdi';
            $this->error('   ✗ FPDI library not installed');
        }
        $this->newLine();

        // Summary
        $this->info('═══════════════════════════════════════');
        $this->info('Summary');
        $this->info('═══════════════════════════════════════');

        if (empty($issues) && empty($warnings)) {
            $this->info('✓ All checks passed! Certificate system is ready.');
        } else {
            if (!empty($issues)) {
                $this->error("\n🚨 Issues found (" . count($issues) . "):");
                foreach ($issues as $i => $issue) {
                    $this->error("   " . ($i + 1) . ". {$issue}");
                }
            }

            if (!empty($warnings)) {
                $this->warn("\n⚠️  Warnings (" . count($warnings) . "):");
                foreach ($warnings as $i => $warning) {
                    $this->warn("   " . ($i + 1) . ". {$warning}");
                }
            }

            if (!empty($issues)) {
                $this->newLine();
                $this->info('Recommended actions:');
                $this->line('1. Run: php artisan storage:link');
                $this->line('2. Run: php artisan certificates:fix-paths');
                $this->line('3. Fix file permissions: chmod -R 755 storage');
                $this->line('4. Fix directory ownership if needed');
            }
        }

        return empty($issues) ? 0 : 1;
    }
}
