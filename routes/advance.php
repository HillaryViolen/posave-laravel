<?php

use App\Http\Controllers\Advance\Owner\DashboardController;
use App\Http\Controllers\Advance\Owner\EmployeeController;
use App\Http\Controllers\Advance\Owner\Inventory\AdjustmentController;
use App\Http\Controllers\Advance\Owner\Inventory\InventoryCategoryController;
use App\Http\Controllers\Advance\Owner\Inventory\InventoryListController;
use App\Http\Controllers\Advance\Owner\Inventory\PurchaseOrderController;
use App\Http\Controllers\Advance\Owner\Inventory\SupplierController;
use App\Http\Controllers\Advance\Owner\Inventory\TransferController;
use App\Http\Controllers\Advance\Owner\MessageController;
use App\Http\Controllers\Advance\Owner\ReportController;

use App\Http\Controllers\Advance\Cashier\HistoryController;
use App\Http\Controllers\Advance\Cashier\OrderController;

use Illuminate\Support\Facades\Route;

// --- ROUTE UNTUK OWNER (Dashboard) ---
Route::middleware('auth')->prefix('dashboard')->name('dashboard.')->group(function () {

  Route::get('/', [DashboardController::class, 'index'])->name('index');

  Route::prefix('inventory')->name('inventory.')->group(function () {

    Route::resource('items', InventoryListController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::resource('transfers', TransferController::class);
    Route::resource('adjustments', AdjustmentController::class);
    Route::resource('categories', InventoryCategoryController::class);
  });

  Route::resource('employees', EmployeeController::class);

  Route::resource('reports', ReportController::class);

  Route::resource('messages', MessageController::class);
});

// --- ROUTE UNTUK CASHIER ---
Route::middleware('auth')->prefix('cashier')->name('cashier.')->group(function () {
    
    Route::get('/order', [OrderController::class, 'index'])->name('order.index');
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    
});