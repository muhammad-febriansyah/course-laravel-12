<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Faq\StoreFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use App\Models\Faq;
use App\Services\FaqService;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function __construct(private readonly FaqService $faqService)
    {
    }

    public function index()
    {
        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $this->faqService->list(),
        ]);
    }

    public function store(StoreFaqRequest $request)
    {
        $this->faqService->create($request->validated());

        return back()->with('success', 'FAQ berhasil ditambahkan.');
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->faqService->update($faq, $request->validated());

        return back()->with('success', 'FAQ berhasil diperbarui.');
    }

    public function destroy(Faq $faq)
    {
        $this->faqService->delete($faq);

        return back()->with('success', 'FAQ berhasil dihapus.');
    }
}
