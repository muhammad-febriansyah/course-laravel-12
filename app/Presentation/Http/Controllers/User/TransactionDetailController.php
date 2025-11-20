<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Presentation\Http\Resources\TransactionResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionDetailController extends Controller
{
    public function __construct(private readonly ImageService $imageService) {}

    public function __invoke(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        if ($transaction->user_id !== $user->id) {
            return redirect()
                ->route('user.transactions')
                ->with('error', 'Transaksi tidak ditemukan.');
        }

        $transaction->load('kelas');

        $resource = TransactionResource::make($transaction)->resolve();

        if (isset($resource['course']['image'])) {
            $resource['course']['image'] = $this->imageService->url($resource['course']['image']);
        }

        return Inertia::render('user/transactions/show', [
            'transaction' => $resource,
        ]);
    }
}
