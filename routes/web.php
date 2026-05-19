<?php

use App\Http\Controllers\Faq\FaqController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\Inquiry\InquiryController;
use Illuminate\Support\Facades\Route;
use App\Models\Testimonial;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome/welcome', [
        'testimonials' => Testimonial::all(),
    ]);
})->name('home');

Route::controller(InquiryController::class)
    ->prefix('hubungi-kami')
    ->name('contact-us.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
    });

Route::get('faq', [FaqController::class, 'index'])->name('faq');

Route::get('/layanan', function () {
    return Inertia::render('services/services');
})->name('service.index');

Route::controller(BlogController::class)
    ->prefix('artikel')
    ->name('artikel.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/semua', 'all')->name('all');
        Route::get('/{id}', 'show')->name('show');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
