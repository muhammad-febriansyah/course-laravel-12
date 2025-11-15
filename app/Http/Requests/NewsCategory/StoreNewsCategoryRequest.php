<?php

namespace App\Http\Requests\NewsCategory;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => [
                'required',
                'file',
                'mimes:jpeg,png,jpg,webp,svg',
                'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml',
                'max:4096',
            ],
        ];
    }
}
