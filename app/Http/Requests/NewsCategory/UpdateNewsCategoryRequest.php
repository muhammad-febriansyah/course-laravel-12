<?php

namespace App\Http\Requests\NewsCategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'image' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,webp,svg',
                'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml',
                'max:4096',
            ],
        ];
    }
}
