<?php

namespace App\Services;

use App\Models\CertificateTemplate;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class CertificateTemplateService
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    public function list(): Collection
    {
        return CertificateTemplate::latest()->get();
    }

    public function create(array $data): CertificateTemplate
    {
        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            $data['background_image'] = $this->imageService->store(
                $data['background_image'],
                'images/certificates',
                'certificate'
            );
        }

        $data['layout'] = $this->normalizeLayout($data['layout'] ?? []);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        return CertificateTemplate::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'background_image' => $data['background_image'] ?? null,
            'layout' => $data['layout'],
            'is_active' => $data['is_active'],
        ]);
    }

    public function update(CertificateTemplate $template, array $data): CertificateTemplate
    {
        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            $this->imageService->delete($template->background_image);

            $data['background_image'] = $this->imageService->store(
                $data['background_image'],
                'images/certificates',
                'certificate'
            );
        } else {
            unset($data['background_image']);
        }

        if (isset($data['layout'])) {
            $data['layout'] = $this->normalizeLayout($data['layout']);
        }

        if (isset($data['is_active'])) {
            $data['is_active'] = (bool) $data['is_active'];
        }

        $template->update($data);

        return $template->refresh();
    }

    public function delete(CertificateTemplate $template): void
    {
        $this->imageService->delete($template->background_image);

        $template->delete();
    }

    protected function normalizeLayout(array $layout): array
    {
        return collect($layout)
            ->map(fn ($field) => [
                'key' => $field['key'] ?? '',
                'label' => $field['label'] ?? '',
                'type' => $field['type'] ?? 'text',
                'x' => isset($field['x']) ? (float) $field['x'] : 0.0,
                'y' => isset($field['y']) ? (float) $field['y'] : 0.0,
                'fontFamily' => $field['fontFamily'] ?? 'Inter',
                'fontSize' => (int) ($field['fontSize'] ?? 24),
                'color' => $field['color'] ?? '#000000',
                'align' => $field['align'] ?? 'left',
            ])
            ->filter(fn ($field) => $field['key'] !== '')
            ->values()
            ->toArray();
    }
}
