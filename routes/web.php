<?php

use App\Http\Controllers\Auth\OtpController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;

Route::middleware('guest')->group(function () {
  Route::get('/verify-otp', [OtpController::class, 'show'])->name('otp.show');
  Route::post('/verify-otp', [OtpController::class, 'verify'])->name('otp.verify');
  Route::post('/verify-otp/resend', [OtpController::class, 'resend'])->name('otp.resend');
});


Route::middleware('auth')->group(function () {
  Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding');
  Route::post('/onboarding', [OnboardingController::class, 'setup'])->name('onboarding.setup');
});

Route::middleware(['auth', 'onboarded'])->group(function () {
  require __DIR__ . '/settings.php';
  require __DIR__ . '/chatbot.php';
});

Route::middleware(['auth', 'onboarded', 'advance'])->group(function () {
  require __DIR__ . '/advance.php';
});

Route::middleware(['auth', 'onboarded', 'lite'])->group(function () {
  require __DIR__ . '/lite.php';
});

require __DIR__ . '/company-profile.php';
require __DIR__ . '/auth.php';
