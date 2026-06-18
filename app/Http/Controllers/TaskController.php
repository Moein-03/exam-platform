<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view("tasks.index");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view("tasks.create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return view("tasks.store");
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        return view("tasks.show");
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return view("tasks.edit");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return view("tasks.update");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return view("tasks.destroy");
    }
}
