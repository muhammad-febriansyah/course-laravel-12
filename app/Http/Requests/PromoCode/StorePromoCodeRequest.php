<?php

namespace App\Http\Requests\PromoCode;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePromoCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:100', Rule::unique('promo_codes', 'code')],
            'discount' => ['required', 'integer', 'between:0,100'],
            'status' => ['required', 'boolean'],
            'image' => ['required', 'file', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
        ];
    }
}

