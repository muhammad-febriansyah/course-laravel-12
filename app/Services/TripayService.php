<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected $apiKey;
    protected $privateKey;
    protected $merchantCode;
    protected $baseUrl;
    protected $isSandbox;

    public function __construct()
    {
        $this->apiKey = config('tripay.api_key');
        $this->privateKey = config('tripay.private_key');
        $this->merchantCode = config('tripay.merchant_code');
        $this->isSandbox = config('tripay.sandbox', true);
        $this->baseUrl = $this->isSandbox
            ? 'https://tripay.co.id/api-sandbox'
            : 'https://tripay.co.id/api';
    }

    /**
     * Get available payment channels
     */
    public function getPaymentChannels()
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/merchant/payment-channel');

            if ($response->successful()) {
                return $response->json()['data'];
            }

            Log::error('Tripay: Failed to get payment channels', [
                'response' => $response->json()
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error('Tripay: Exception getting payment channels', [
                'error' => $e->getMessage()
            ]);

            return [];
        }
    }

    /**
     * Create transaction
     */
    public function createTransaction($data)
    {
        try {
            $merchantRef = $data['merchant_ref'] ?? ('INV-' . time());
            $amount = $data['amount'];

            $signature = hash_hmac('sha256', $this->merchantCode . $merchantRef . $amount, $this->privateKey);

            $payload = [
                'method' => $data['method'],
                'merchant_ref' => $merchantRef,
                'amount' => $amount,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'] ?? '',
                'order_items' => $data['order_items'],
                'return_url' => $data['return_url'] ?? route('transactions.index'),
                'callback_url' => $data['callback_url'] ?? route('tripay.callback'),
                'expired_time' => $data['expired_time'] ?? (time() + (24 * 60 * 60)), // 24 hours
                'signature' => $signature,
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->post($this->baseUrl . '/transaction/create', $payload);

            if ($response->successful()) {
                $result = $response->json();

                if ($result['success']) {
                    return [
                        'success' => true,
                        'data' => $result['data'],
                    ];
                }
            }

            Log::error('Tripay: Failed to create transaction', [
                'response' => $response->json()
            ]);

            return [
                'success' => false,
                'message' => $response->json()['message'] ?? 'Failed to create transaction',
            ];
        } catch (\Exception $e) {
            Log::error('Tripay: Exception creating transaction', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get transaction detail
     */
    public function getTransactionDetail($reference)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/transaction/detail', [
                'reference' => $reference,
            ]);

            if ($response->successful()) {
                return $response->json()['data'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Tripay: Exception getting transaction detail', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Validate callback signature
     */
    public function validateCallbackSignature($callbackSignature, $json)
    {
        $signature = hash_hmac('sha256', $json, $this->privateKey);

        return $signature === $callbackSignature;
    }
}
