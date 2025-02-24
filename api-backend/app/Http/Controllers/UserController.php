<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function register(Request $request)
    {
        $data = $request->all();
        $result = $this->userService->registerUser($data);

        if ($result['status'] === 'error') {
            return response()->json(['errors' => $result['errors']], 422);
        }

        return response()->json(['message' => 'User registered successfully', 'user' => $result['user']], 201);
    }

    public function login(Request $request)
    {
        $data = $request->all();
        $result = $this->userService->loginUser($data);

        if ($result['status'] === 'error') {
        return response()->json(['message' => $result['message']], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $result['user'],
            'token' => $result['token']
        ], 200);
    }
}
