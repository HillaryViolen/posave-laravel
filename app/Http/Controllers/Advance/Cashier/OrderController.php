<?php

namespace App\Http\Controllers\Advance\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('advance/cashier/order/order');
    }
}