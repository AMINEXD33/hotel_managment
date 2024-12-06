<?php

namespace App\Http\Middleware;
use Illuminate\Auth\AuthenticationException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenValidity
{
    protected function redirectTo($request)
    {
        if ($request->expectsJson()) {
            throw new AuthenticationException('Unauthenticated.');
        }

        return response()->json(['valid' => auth()->check()]);
    }

}
