<?php

use App\Http\Controllers\Advance\Owner\DashboardController;
use App\Http\Controllers\Advance\Owner\Employee\EmployeeController;
use App\Http\Controllers\Advance\Owner\Employee\EmployeeAccessController;
use App\Http\Controllers\Advance\Owner\Inventory\AdjustmentController;
use App\Http\Controllers\Advance\Owner\Inventory\CategoryController;
use App\Http\Controllers\Advance\Owner\Inventory\ItemController;
use App\Http\Controllers\Advance\Owner\Inventory\PurchaseOrderController;
use App\Http\Controllers\Advance\Owner\Inventory\SupplierController;
use App\Http\Controllers\Advance\Owner\Inventory\TransferController;
use App\Http\Controllers\Advance\Owner\MessageController;
use App\Http\Controllers\Advance\Owner\ReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->name('dashboard.')->group(function () {

  Route::get('/', [DashboardController::class, 'index'])->name('index');

  Route::prefix('inventory')->name('inventory.')->group(function () {
    Route::resource('items', ItemController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::resource('transfers', TransferController::class);
    Route::resource('adjustments', AdjustmentController::class);
    Route::resource('categories', CategoryController::class);
  });

  Route::resource('employees', EmployeeController::class);
  Route::resource('employees-access', EmployeeAccessController::class);

  Route::resource('reports', ReportController::class);

  Route::resource('messages', MessageController::class);
});
