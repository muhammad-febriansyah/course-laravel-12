<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Presentation\Http\Resources\TransactionResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionHistoryController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $transactions = Transaction::query()
            ->with(['kelas'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $transactions = TransactionResource::collection($transactions)
            ->resolve();

        $imageService = $this->imageService;
        $transactions = array_map(static function (array $transaction) use ($imageService) {
            if (isset($transaction['course']['image'])) {
                $transaction['course']['image'] = $imageService->url(
                    $transaction['course']['image'],
                );
            }

            return $transaction;
        }, $transactions);

        return Inertia::render('user/transactions/index', [
            'transactions' => $transactions,
        ]);
    }
}
