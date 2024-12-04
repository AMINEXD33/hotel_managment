<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorehotelsRequest;
use App\Http\Requests\UpdatehotelsRequest;
use App\Models\hotels;

class HotelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorehotelsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(hotels $hotels)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(hotels $hotels)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatehotelsRequest $request, hotels $hotels)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(hotels $hotels)
    {
        //
    }
}
