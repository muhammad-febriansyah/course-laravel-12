<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tripay API Configuration
    |--------------------------------------------------------------------------
    */

    'api_key' => env('TRIPAY_API_KEY', ''),
    'private_key' => env('TRIPAY_PRIVATE_KEY', ''),
    'merchant_code' => env('TRIPAY_MERCHANT_CODE', ''),
    'sandbox' => env('TRIPAY_SANDBOX', true),
];
