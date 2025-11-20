<?php

namespace App\Console\Commands;

use App\Models\CertificateTemplate;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixCertificateTemplatePaths extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'certificates:fix-paths';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix certificate template paths from old images/certificates to new certificates path';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting certificate template path migration...');

        $templates = CertificateTemplate::all();

        if ($templates->isEmpty()) {
            $this->warn('No certificate templates found.');
            return 0;
        }

        $fixed = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($templates as $template) {
            $oldPath = $template->background_image;

            if (!$oldPath) {
                $this->line("Template #{$template->id} has no background image. Skipping.");
                $skipped++;
                continue;
            }

            // Remove leading slash if exists
            $oldPath = ltrim($oldPath, '/');

            // Check if path starts with 'images/certificates'
            if (str_starts_with($oldPath, 'images/certificates/')) {
                $newPath = str_replace('images/certificates/', 'certificates/', $oldPath);

                // Try multiple paths for old file
                $oldPaths = [
                    storage_path('app/public/' . $oldPath), // storage/app/public/images/certificates/
                    public_path($oldPath), // public/images/certificates/ (old system)
                    public_path('/' . $oldPath), // public/images/certificates/ with leading slash
                ];

                $oldFullPath = null;
                foreach ($oldPaths as $path) {
                    if (file_exists($path)) {
                        $oldFullPath = $path;
                        break;
                    }
                }

                $newFullPath = storage_path('app/public/' . $newPath);

                if ($oldFullPath) {
                    // Ensure new directory exists
                    $newDir = dirname($newFullPath);
                    if (!is_dir($newDir)) {
                        mkdir($newDir, 0755, true);
                    }

                    // Move file to new location
                    if (File::move($oldFullPath, $newFullPath)) {
                        // Update database
                        $template->update(['background_image' => $newPath]);
                        $this->info("✓ Template #{$template->id}: Moved and updated path");
                        $this->line("  From: {$oldFullPath}");
                        $this->line("  To:   {$newFullPath}");
                        $fixed++;
                    } else {
                        $this->error("✗ Template #{$template->id}: Failed to move file");
                        $errors++;
                    }
                } else {
                    // File doesn't exist in any old path, just update database
                    $this->warn("! Template #{$template->id}: File not found at any old path, updating database only");
                    $template->update(['background_image' => $newPath]);
                    $this->line("  Updated: {$oldPath} → {$newPath}");
                    $fixed++;
                }
            } else {
                $this->line("Template #{$template->id} already using correct path. Skipping.");
                $skipped++;
            }
        }

        $this->newLine();
        $this->info('Migration completed!');
        $this->table(
            ['Status', 'Count'],
            [
                ['Fixed', $fixed],
                ['Skipped', $skipped],
                ['Errors', $errors],
            ]
        );

        return 0;
    }
}
