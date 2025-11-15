<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Presentation\Http\Resources\TransactionResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionDetailController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function __invoke(Request $request, Transaction $transaction): Response
    {
        $user = $request->user();

        abort_if($transaction->user_id !== $user->id, 404);

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
