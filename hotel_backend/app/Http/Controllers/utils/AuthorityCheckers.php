<?php

namespace App\Http\Controllers\utils;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthorityCheckers
{

    /** a function to check if a user is admin
     * @param User $user
     * @return bool
     */
    static function isAdmin(User $user): bool
    {
        if ($user->is_admin == 1) {
            return true;
        }
        return false;
    }

    /** a function to check if a user is a normal user
     * @param User $user
     * @return bool
     */
    static function isUser(User $user): bool
    {
        if ($user->is_admin == 0) {
            return true;
        }
        return false;
    }

    static function isUserAdmin(): JsonResponse|bool
    {
        $session_client_id = auth()->id();
        $user = User::query()->find($session_client_id);
        if (!AuthorityCheckers::isAdmin($user)){
            return response()->json(["error" => "you don't have permission"], 403);
        }
        return true;
    }
}
