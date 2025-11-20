<?php

namespace App\Http\Requests\Level;

use Illuminate\Foundation\Http\FormRequest;

class StoreLevelRequest extends FormRequest
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

