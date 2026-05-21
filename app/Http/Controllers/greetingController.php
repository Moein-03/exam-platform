<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class greetingController extends Controller
{

    function show()
    {
        return view('greeting',["name"=>"Moein","family"=>"Khosravi"]);
    }
}
