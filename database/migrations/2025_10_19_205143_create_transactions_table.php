<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('promo_code_id')->nullable()->constrained('promo_codes')->onDelete('set null');

            // Payment Details
            $table->enum('payment_method', ['tripay', 'cash'])->default('tripay');
            $table->string('payment_channel')->nullable(); // e.g., QRIS, BCA, Mandiri, dll
            $table->decimal('amount', 15, 2); // Harga asli
            $table->decimal('discount', 15, 2)->default(0); // Diskon dari promo
            $table->decimal('total', 15, 2); // Total yang harus dibayar
            $table->decimal('admin_fee', 15, 2)->default(0); // Fee payment gateway

            // Tripay Integration
            $table->string('tripay_reference')->nullable()->unique(); // Reference dari Tripay
            $table->string('tripay_merchant_ref')->nullable(); // Merchant reference
            $table->string('payment_url')->nullable(); // URL pembayaran
            $table->text('payment_instructions')->nullable(); // Instruksi pembayaran (JSON)

            // Status
            $table->enum('status', ['pending', 'paid', 'expired', 'failed', 'refund'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();

            // Additional Info
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Data tambahan (callback dari Tripay, dll)

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('invoice_number');
            $table->index('tripay_reference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
