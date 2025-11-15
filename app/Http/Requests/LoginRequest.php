<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use ReCaptcha\ReCaptcha;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'g-recaptcha-response' => ['required', function ($attribute, $value, $fail) {
                $recaptcha = new ReCaptcha(config('services.recaptcha.secret_key'));
                $response = $recaptcha->verify($value, $this->ip());

                if (!$response->isSuccess()) {
                    $fail('Verifikasi reCAPTCHA gagal. Silakan coba lagi.');
                }
            }],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'g-recaptcha-response' => 'reCAPTCHA',
        ];
    }
}
