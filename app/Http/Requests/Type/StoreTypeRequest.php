<?php

namespace App\Http\Requests\Type;

use Illuminate\Foundation\Http\FormRequest;

class StoreTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['required', 'file', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
        ];
    }
}

