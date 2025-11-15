<?php

namespace App\Http\Controllers;

use App\Http\Requests\CertificateTemplate\StoreCertificateTemplateRequest;
use App\Http\Requests\CertificateTemplate\UpdateCertificateTemplateRequest;
use App\Models\CertificateTemplate;
use App\Services\CertificateTemplateService;
use Inertia\Inertia;

class CertificateTemplateController extends Controller
{
    public function __construct(
        protected CertificateTemplateService $certificateTemplateService,
        protected \App\Services\CertificateGeneratorService $certificateGeneratorService,
    ) {
    }

    public function index()
    {
        return Inertia::render('certificates/index', [
            'templates' => $this->certificateTemplateService->list(),
        ]);
    }

    public function create()
    {
        return Inertia::render('certificates/create', [
            'defaultLayout' => $this->defaultLayout(),
        ]);
    }

    public function show(CertificateTemplate $certificate)
    {
        return Inertia::render('certificates/show', [
            'certificate' => $certificate,
        ]);
    }

    public function edit(CertificateTemplate $certificate)
    {
        return Inertia::render('certificates/edit', [
            'certificate' => $certificate,
        ]);
    }

    public function store(StoreCertificateTemplateRequest $request)
    {
        $data = $request->validated();
        $data['background_image'] = $request->file('background_image');

        $this->certificateTemplateService->create($data);

        return redirect()
            ->route('admin.certificates.index')
            ->with('success', 'Template sertifikat berhasil dibuat.');
    }

    public function update(UpdateCertificateTemplateRequest $request, CertificateTemplate $certificate)
    {
        $data = $request->validated();
        $data['background_image'] = $request->file('background_image', $certificate->background_image);

        $this->certificateTemplateService->update($certificate, $data);

        return redirect()
            ->route('admin.certificates.index')
            ->with('success', 'Template sertifikat berhasil diperbarui.');
    }

    public function destroy(CertificateTemplate $certificate)
    {
        $this->certificateTemplateService->delete($certificate);

        return back()->with('success', 'Template sertifikat berhasil dihapus.');
    }

    /**
     * Generate a preview certificate with sample data
     */
    public function preview(CertificateTemplate $certificate)
    {
        // Sample data for preview
        $sampleData = [
            'recipient_name' => 'John Doe',
            'course_name' => 'Laravel Advanced Course',
            'issue_date' => now()->format('d F Y'),
            'certificate_id' => 'CERT-' . strtoupper(uniqid()),
            'signature_name' => 'Jane Smith',
        ];

        try {
            $certificatePath = $this->certificateGeneratorService->generate($certificate, $sampleData);
            // $certificatePath is already a path like /certificates/generated/cert_xxx.pdf
            $url = url($certificatePath);

            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $certificatePath,
            ]);
        } catch (\Exception $e) {
            \Log::error('Certificate generation failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal generate preview: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function defaultLayout(): array
    {
        return [
            [
                'key' => 'recipient_name',
                'label' => 'Nama Penerima',
                'type' => 'text',
                'x' => 50,
                'y' => 45,
                'fontFamily' => 'Inter',
                'fontSize' => 36,
                'color' => '#1f2937',
                'align' => 'center',
            ],
            [
                'key' => 'course_name',
                'label' => 'Nama Kursus',
                'type' => 'text',
                'x' => 50,
                'y' => 60,
                'fontFamily' => 'Inter',
                'fontSize' => 24,
                'color' => '#374151',
                'align' => 'center',
            ],
            [
                'key' => 'issue_date',
                'label' => 'Tanggal Terbit',
                'type' => 'text',
                'x' => 20,
                'y' => 80,
                'fontFamily' => 'Inter',
                'fontSize' => 18,
                'color' => '#4b5563',
                'align' => 'left',
            ],
            [
                'key' => 'certificate_id',
                'label' => 'ID Sertifikat',
                'type' => 'text',
                'x' => 80,
                'y' => 80,
                'fontFamily' => 'Inter',
                'fontSize' => 18,
                'color' => '#4b5563',
                'align' => 'right',
            ],
            [
                'key' => 'signature_name',
                'label' => 'Nama Penandatangan',
                'type' => 'text',
                'x' => 75,
                'y' => 88,
                'fontFamily' => 'Dancing Script',
                'fontSize' => 28,
                'color' => '#111827',
                'align' => 'center',
            ],
        ];
    }
}
