<?php

namespace App\Http\Requests\CertificateTemplate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCertificateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Allow partial updates: only validate name when it is present
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'background_image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,pdf', 'max:8192'],
            'is_active' => ['nullable', Rule::in(['0', '1', 0, 1, true, false])],
            'layout' => ['nullable', 'array'],
            'layout.*.key' => ['required', 'string', 'max:100'],
            'layout.*.label' => ['required', 'string', 'max:150'],
            'layout.*.type' => ['required', 'string', Rule::in(['text'])],
            'layout.*.x' => ['required', 'numeric', 'between:0,100'],
            'layout.*.y' => ['required', 'numeric', 'between:0,100'],
            'layout.*.fontFamily' => ['nullable', 'string', 'max:100'],
            'layout.*.fontSize' => ['required', 'integer', 'between:8,120'],
            'layout.*.color' => ['nullable', 'string', 'max:20'],
            'layout.*.align' => ['nullable', 'string', Rule::in(['left', 'center', 'right'])],
        ];
    }
}
