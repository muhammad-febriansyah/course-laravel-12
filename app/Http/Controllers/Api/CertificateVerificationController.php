<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateVerificationController extends Controller
{
    /**
     * Verify certificate by code
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $certificateCode = strtoupper(trim($request->code));

        // Find enrollment by certificate code
        $enrollment = Enrollment::with(['user', 'kelas.user'])
            ->where('certificate_code', $certificateCode)
            ->where('status', 'active')
            ->whereNotNull('completed_at')
            ->whereNotNull('certificate_issued_at')
            ->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Kode sertifikat tidak ditemukan atau tidak valid.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Sertifikat valid.',
            'data' => [
                'code' => $enrollment->certificate_code,
                'name' => $enrollment->user->name,
                'course' => $enrollment->kelas->title,
                'issuedAt' => $enrollment->certificate_issued_at->format('d F Y'),
                'mentor' => $enrollment->kelas->user->name,
                'status' => 'Valid',
                'completedAt' => $enrollment->completed_at->format('d F Y'),
            ],
        ]);
    }
}
