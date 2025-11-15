<?php

namespace App\Http\Controllers;

use App\Http\Requests\Benefit\StoreBenefitRequest;
use App\Http\Requests\Benefit\UpdateBenefitRequest;
use App\Models\Benefit;
use App\Services\BenefitService;
use Inertia\Inertia;

class BenefitController extends Controller
{
    public function __construct(
        protected BenefitService $benefitService,
    ) {
    }

    public function index()
    {
        return Inertia::render('benefits/index', [
            'benefits' => $this->benefitService->list(),
        ]);
    }

    public function store(StoreBenefitRequest $request)
    {
        $this->benefitService->create($request->validated());

        return back()->with('success', 'Benefit berhasil ditambahkan.');
    }

    public function update(UpdateBenefitRequest $request, Benefit $benefit)
    {
        $this->benefitService->update($benefit, $request->validated());

        return back()->with('success', 'Benefit berhasil diperbarui.');
    }

    public function destroy(Benefit $benefit)
    {
        $this->benefitService->delete($benefit);

        return back()->with('success', 'Benefit berhasil dihapus.');
    }
}

