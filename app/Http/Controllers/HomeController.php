<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
     public function index()
     {
          $user = auth()->user();
          
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
          return view('app', ['pageProps' => $pageProps]);
          /* return view('app', [
               'user' => $user
          ]); */
     }
}