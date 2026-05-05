<?php

use App\Http\Controllers\Inquiry\InquiryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome/welcome');
})->name('home');

Route::get('hubungi-kami', [InquiryController::class, 'index'])->name('contact-us');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
