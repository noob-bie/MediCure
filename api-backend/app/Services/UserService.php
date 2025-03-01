<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory; // Import the InMemory class
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Configuration;
use DateTimeImmutable;



class UserService
{
    private $jwtConfig;

    public function __construct()
    {
        $this->jwtConfig = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText(env('JWT_SECRET')) // Use InMemory::plainText
        );
    }

    public function registerUser(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string|unique:users',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            return ['status' => 'error', 'errors' => $validator->errors()];
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'role' => 'user'
        ]);

        return ['status' => 'success', 'user' => $user];
    }

    public function loginUser(array $data)
    {

        $validator = Validator::make($data, [
            'phone' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|string|in:user,admin,delivery man' // Validate role (Action 2 & 3)
        ]);

        if ($validator->fails()) {
            return ['status' => 'error', 'message' => 'Validation error', 'errors' => $validator->errors()]; // More informative error
        }

        $user = User::where('phone', $data['phone'])->first();

        if (!$user) {
            return ['status' => 'error', 'message' => 'Invalid credentials']; // More generic message
        }

        if (!Hash::check($data['password'], $user->password) || $user->role !== $data['role']) {
            return ['status' => 'error', 'message' => 'Invalid credentials'];
        }

        // Generate JWT token
        $token = $this->generateJwtToken($user);

        return ['status' => 'success', 'user' => $user, 'token' => $token];

        /*

        http://127.0.0.1:8000/api/login


        fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: "01996410700", password: "123456" })
        })
        .then(response => response.json())
        .then(data => console.log("Response:", data))
        .catch(error => console.error("Error:", error));

        */

    }

    private function generateJwtToken($user)
    {
        $now = new DateTimeImmutable();

        return $this->jwtConfig->builder()
            ->issuedBy('http://localhost') // Change to your app's domain
            ->permittedFor('http://localhost:5173')
            ->identifiedBy(uniqid(), true)
            ->issuedAt($now)
            ->expiresAt($now->modify('+1 hour')) // Token expires in 1 hour
            ->withClaim('uid', $user->id) // Store user ID in token
            ->withClaim('role', $user->role) // Store role in token
            ->getToken($this->jwtConfig->signer(), $this->jwtConfig->signingKey())
            ->toString();
    }
}
