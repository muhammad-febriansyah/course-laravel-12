<?php

namespace App\Http\Controllers;

use App\Http\Requests\PromoCode\StorePromoCodeRequest;
use App\Http\Requests\PromoCode\UpdatePromoCodeRequest;
use App\Models\PromoCode;
use App\Services\PromoCodeService;
use Inertia\Inertia;

class PromoCodeController extends Controller
{
    public function __construct(
        protected PromoCodeService $promoCodeService,
    ) {
    }

    public function index()
    {
        return Inertia::render('promo-codes/index', [
            'promoCodes' => $this->promoCodeService->list(),
        ]);
    }

    public function store(StorePromoCodeRequest $request)
    {
        $this->promoCodeService->create($request->validated());

        return back()->with('success', 'Kode promo berhasil ditambahkan.');
    }

    public function update(UpdatePromoCodeRequest $request, PromoCode $promoCode)
    {
        $this->promoCodeService->update($promoCode, $request->validated());

        return back()->with('success', 'Kode promo berhasil diperbarui.');
    }

    public function destroy(PromoCode $promoCode)
    {
        $this->promoCodeService->delete($promoCode);

        return back()->with('success', 'Kode promo berhasil dihapus.');
    }
}

