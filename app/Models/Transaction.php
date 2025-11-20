<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'user_id',
        'kelas_id',
        'promo_code_id',
        'payment_method',
        'payment_channel',
        'amount',
        'discount',
        'total',
        'admin_fee',
        'mentor_earnings',
        'platform_fee',
        'tripay_reference',
        'tripay_merchant_ref',
        'payment_url',
        'payment_instructions',
        'status',
        'paid_at',
        'expired_at',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'admin_fee' => 'decimal:2',
        'mentor_earnings' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'metadata' => 'array',
        'payment_instructions' => 'array',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function promoCode(): BelongsTo
    {
        return $this->belongsTo(PromoCode::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->whereNotNull('paid_at');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    // Helper Methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isPaid(): bool
    {
        return $this->paid_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired';
    }

    public function isCash(): bool
    {
        return $this->payment_method === 'cash';
    }

    public function isTripay(): bool
    {
        return $this->payment_method === 'tripay';
    }

    public function markAsPaid(): void
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function markAsExpired(): void
    {
        $this->update([
            'status' => 'expired',
        ]);
    }

    // Generate Invoice Number
    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV';
        $date = date('Ymd');
        $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);

        return "{$prefix}/{$date}/{$random}";
    }
}
