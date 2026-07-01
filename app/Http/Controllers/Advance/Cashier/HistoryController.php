<?php

namespace App\Http\Controllers\Advance\Cashier;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        return Inertia::render('advance/cashier/history/history');
    }
}
