<?php

namespace App\Presentation\Http\Controllers\Front;

use App\Application\Checkout\CheckoutService;
use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PromoCode;
use App\Models\Setting;
use App\Presentation\Http\Resources\CourseResource;
use App\Services\TripayService;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly TripayService $tripayService,
        private readonly ImageService $imageService,
    ) {
    }

    public function show(Request $request, string $slug): Response
    {
        $course = Kelas::query()
            ->with(['category', 'level', 'type', 'user'])
            ->where('slug', $slug)
            ->whereIn('status', [1, Kelas::STATUS_APPROVED])
            ->firstOrFail();

        $alreadyEnrolled = $request->user()
            ->enrollments()
            ->where('kelas_id', $course->id)
            ->exists();

        $promos = PromoCode::query()
            ->where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'discount']);

        $tripayChannels = collect($this->tripayService->getPaymentChannels())
            ->filter(static fn ($channel) => ($channel['active'] ?? false) === true)
            ->map(static function ($channel) {
                return [
                    'code' => $channel['code'] ?? '',
                    'name' => $channel['name'] ?? ($channel['code'] ?? ''),
                    'group' => $channel['group'] ?? null,
                    'feeCustomer' => (float) ($channel['fee_customer'] ?? 0),
                    'feeMerchant' => (float) ($channel['fee_merchant'] ?? 0),
                    'iconUrl' => $channel['icon_url'] ?? null,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('front/checkout/show', [
            'settings' => $this->prepareSettings(),
            'course' => CourseResource::make($course)->resolve(),
            'promos' => $promos,
            'alreadyEnrolled' => $alreadyEnrolled,
            'tripayChannels' => $tripayChannels,
        ]);
    }

    public function store(Request $request, string $slug): RedirectResponse
    {
        $course = Kelas::query()
            ->where('slug', $slug)
            ->whereIn('status', [1, Kelas::STATUS_APPROVED])
            ->firstOrFail();

        $validated = $request->validate([
            'payment_method' => 'required|in:cash,tripay',
            'promo_code' => 'nullable|string|max:32',
            'payment_channel' => 'required_if:payment_method,tripay|string|max:50',
        ]);

        try {
            $transaction = $this->checkoutService->initiate($request->user(), $course, $validated);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $throwable) {
            report($throwable);

            throw ValidationException::withMessages([
                'payment_method' => 'Gagal memproses checkout, silakan coba lagi.',
            ]);
        }

        $redirectRoute = $transaction->status === 'paid'
            ? 'dashboard'
            : 'user.transactions.show';

        $redirectParams = $transaction->status === 'paid'
            ? []
            : ['transaction' => $transaction->id];

        return redirect()
            ->route($redirectRoute, $redirectParams)
            ->with(
                $transaction->status === 'paid' ? 'success' : 'info',
                $transaction->status === 'paid'
                    ? 'Pembelian berhasil! Kursus sudah dapat diakses.'
                    : 'Transaksi berhasil dibuat. Silakan selesaikan pembayaran.'
            );
    }

    protected function prepareSettings(): ?array
    {
        $settings = Setting::first();

        if (! $settings) {
            return null;
        }

        $data = $settings->toArray();

        foreach (['logo', 'favicon', 'thumbnail', 'home_thumbnail'] as $field) {
            $data[$field] = $this->imageService->url($settings->$field);
        }

        return $data;
    }
}
