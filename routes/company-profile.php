<?php

use App\Http\Controllers\CompanyProfile\BlogController;
use App\Http\Controllers\CompanyProfile\FaqController;
use App\Http\Controllers\CompanyProfile\InquiryController;
use App\Models\CompanyProfile\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
  return Inertia::render('company-profile/welcome/welcome', [
    'testimonials' => Testimonial::all(),
  ]);
})->name('home');

Route::prefix('hubungi-kami')->name('contact-us.')->group(function () {
  Route::get('/', [InquiryController::class, 'index'])->name('index');
  Route::post('/', [InquiryController::class, 'store'])->name('store');
});

Route::get('faq', [FaqController::class, 'index'])->name('faq');

Route::get('/layanan', function () {
  return Inertia::render('company-profile/services/services');
})->name('service.index');

Route::prefix('artikel')->name('artikel.')->group(function () {
  Route::get('/', [BlogController::class, 'index'])->name('index');
  Route::get('/semua', [BlogController::class, 'all'])->name('all');
  Route::get('/{id}', [BlogController::class, 'show'])->name('show');
});
