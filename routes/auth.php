<?php

use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('register.store');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Public-facing user auth pages (separate URLs)
Route::middleware('guest')->group(function () {
    // Pretty URLs for public user auth pages
    Route::get('masuk', function () {
        return Inertia::render('user/auth/login');
    })->name('user.login');

    Route::get('daftar', function () {
        return Inertia::render('user/auth/register');
    })->name('user.register');

    // Accept POST to /daftar as an alias to /register
    Route::post('daftar', [RegisteredUserController::class, 'store'])
        ->name('user.register.store');
});
