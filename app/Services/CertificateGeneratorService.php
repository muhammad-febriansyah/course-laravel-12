<?php

namespace App\Services;

use App\Models\CertificateTemplate;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class CertificateGeneratorService
{
    /**
     * Generate a certificate from a template with dynamic data
     *
     * @param CertificateTemplate $template
     * @param array $data Data to fill in the certificate (e.g., recipient_name, course_name, etc.)
     * @return string Path to the generated certificate
     */
    public function generate(CertificateTemplate $template, array $data): string
    {
        // Background image is stored in public/ directory directly (not storage/app/public)
        // Path in database is like: /images/certificates/certificate_xxx.pdf
        $backgroundPath = public_path($template->background_image);

        // Check if file exists
        if (!file_exists($backgroundPath)) {
            throw new \Exception("Template file not found: {$backgroundPath}");
        }

        // Check if background is PDF or image
        $isPdf = $this->isPdfFile($backgroundPath);

        if ($isPdf) {
            return $this->generateFromPdfTemplate($template, $data, $backgroundPath);
        }

        return $this->generateFromImageTemplate($template, $data, $backgroundPath);
    }

    /**
     * Generate certificate from PDF template
     */
    protected function generateFromPdfTemplate(CertificateTemplate $template, array $data, string $pdfPath): string
    {
        $pdf = new Fpdi();

        // Import the PDF template
        $pageCount = $pdf->setSourceFile($pdfPath);

        // Use the first page as template
        $templateId = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($templateId);

        // Add a page with the same orientation and size as the template
        $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
        $pdf->AddPage($orientation, [$size['width'], $size['height']]);

        // Use the imported page as background
        $pdf->useTemplate($templateId);

        // Add text fields based on layout configuration
        foreach ($template->layout ?? [] as $field) {
            $this->addTextField($pdf, $field, $data, $size['width'], $size['height']);
        }

        // Save the generated PDF in public directory
        $filename = uniqid('cert_', true) . '.pdf';
        $outputPath = '/certificates/generated/' . $filename;
        $fullPath = public_path($outputPath);

        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $pdf->Output('F', $fullPath);

        return $outputPath;
    }

    /**
     * Generate certificate from image template
     */
    protected function generateFromImageTemplate(CertificateTemplate $template, array $data, string $imagePath): string
    {
        $pdf = new Fpdi();

        // Get image dimensions
        $imageSize = getimagesize($imagePath);
        $width = $imageSize[0] * 0.264583; // Convert pixels to mm (96 DPI)
        $height = $imageSize[1] * 0.264583;

        // Determine orientation
        $orientation = $width > $height ? 'L' : 'P';

        // Add a page
        $pdf->AddPage($orientation, [$width, $height]);

        // Add the image as background
        $pdf->Image($imagePath, 0, 0, $width, $height);

        // Add text fields based on layout configuration
        foreach ($template->layout ?? [] as $field) {
            $this->addTextField($pdf, $field, $data, $width, $height);
        }

        // Save the generated PDF in public directory
        $filename = uniqid('cert_', true) . '.pdf';
        $outputPath = '/certificates/generated/' . $filename;
        $fullPath = public_path($outputPath);

        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $pdf->Output('F', $fullPath);

        return $outputPath;
    }

    /**
     * Add text field to PDF
     */
    protected function addTextField(Fpdi $pdf, array $field, array $data, float $pageWidth, float $pageHeight): void
    {
        // Get the value for this field from data
        $value = $data[$field['key']] ?? $field['label'];

        // Convert percentage position to absolute position
        $x = ($field['x'] / 100) * $pageWidth;
        $y = ($field['y'] / 100) * $pageHeight;

        // Set font (using built-in fonts for now)
        $fontFamily = $this->mapFontFamily($field['fontFamily'] ?? 'Inter');
        $pdf->SetFont($fontFamily, '', $field['fontSize'] ?? 12);

        // Set text color
        $color = $this->hexToRgb($field['color'] ?? '#000000');
        $pdf->SetTextColor($color['r'], $color['g'], $color['b']);

        // Calculate text width for alignment
        $textWidth = $pdf->GetStringWidth($value);

        // Adjust x position based on alignment
        $align = $field['align'] ?? 'left';
        if ($align === 'center') {
            $x = $x - ($textWidth / 2);
        } elseif ($align === 'right') {
            $x = $x - $textWidth;
        }

        // Add text
        $pdf->SetXY($x, $y);
        $pdf->Cell($textWidth, $field['fontSize'] ?? 12, $value, 0, 0, 'L');
    }

    /**
     * Map font family to FPDF built-in fonts
     */
    protected function mapFontFamily(string $fontFamily): string
    {
        $fontMap = [
            'Inter' => 'Arial',
            'Helvetica' => 'Helvetica',
            'Times New Roman' => 'Times',
            'Courier' => 'Courier',
            'Dancing Script' => 'Times', // Fallback for script fonts
        ];

        return $fontMap[$fontFamily] ?? 'Arial';
    }

    /**
     * Convert hex color to RGB
     */
    protected function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');

        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }

        return [
            'r' => hexdec(substr($hex, 0, 2)),
            'g' => hexdec(substr($hex, 2, 2)),
            'b' => hexdec(substr($hex, 4, 2)),
        ];
    }

    /**
     * Check if file is PDF
     */
    protected function isPdfFile(string $path): bool
    {
        if (!file_exists($path)) {
            return false;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        return $extension === 'pdf';
    }
}
