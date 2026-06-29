<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
     public function index()
     {
          $user = auth()->user();

          if($user) {
               if ($user->isTeacher()) {
                    $pageProps = [
                         'isTeacher' => true,
                         'auth' => ['user' => $user]
                    ];
               } else {
                    $pageProps = [
                         'isTeacher' => false,
                         'auth' => ['user' => $user]
                    ];
               }
          } else {
               $pageProps = [
                    'isTeacher' => false,
                    'auth' => ['user' => null]
               ];
          }

          return view('home', ['pageProps' => $pageProps]);
     }
}