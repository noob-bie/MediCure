<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
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
            new Key(env('JWT_SECRET')) // Load secret key from .env
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
        $user = User::where('phone', $data['phone'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return ['status' => 'error', 'message' => 'Invalid credentials'];
        }

        // Generate JWT token
        $token = $this->generateJwtToken($user);

        return ['status' => 'success', 'user' => $user, 'token' => $token];
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
