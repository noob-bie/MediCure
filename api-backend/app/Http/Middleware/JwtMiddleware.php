<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Exception;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json(['message' => 'Token not provided'], 401);
            }

            // Load JWT configuration
            $config = Configuration::forSymmetricSigner(
                new Sha256(),
                InMemory::plainText(env('JWT_SECRET'))
            );

            // Parse token
            $parsedToken = $config->parser()->parse($token);

            // Validate token
            if (!$config->validator()->validate($parsedToken, ...$config->validationConstraints())) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            return $next($request);
        } catch (Exception $e) {
            return response()->json(['message' => 'Unauthorized', 'error' => $e->getMessage()], 401);
        }
    }
}
