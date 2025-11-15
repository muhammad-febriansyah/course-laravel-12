<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoiceNumber' => $this->invoice_number,
            'status' => $this->status,
            'paymentMethod' => $this->payment_method,
            'paymentChannel' => $this->payment_channel,
            'amount' => (float) $this->amount,
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'adminFee' => (float) $this->admin_fee,
            'paymentUrl' => $this->payment_url,
            'tripayReference' => $this->tripay_reference,
            'paymentInstructions' => $this->payment_instructions,
            'metadata' => $this->metadata,
            'paidAt' => optional($this->paid_at)->toDateTimeString(),
            'expiredAt' => optional($this->expired_at)->toDateTimeString(),
            'createdAt' => optional($this->created_at)->toDateTimeString(),
            'course' => $this->whenLoaded('kelas', fn () => [
                'id' => $this->kelas?->id,
                'title' => $this->kelas?->title,
                'slug' => $this->kelas?->slug,
                'image' => $this->kelas?->image,
            ]),
        ];
    }
}
