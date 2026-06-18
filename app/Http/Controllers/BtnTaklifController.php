<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BtnTaklifController extends Controller
{
    public function index()
    {
        return view('buttonTaklif');
    }
}