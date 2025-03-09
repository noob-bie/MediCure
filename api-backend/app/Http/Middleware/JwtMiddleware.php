<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\UserService;
use Exception;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use App\Models\User; // Add this line to use the User model

class JwtMiddleware
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function handle(Request $request, Closure $next)
    {
        try {
            // Get token from request
            $tokenString = $request->bearerToken();

            if (!$tokenString) {
                return response()->json(['message' => 'Token not provided'], 401);
            }

            // Get JWT config from UserService
            $jwtConfig = $this->userService->getJwtConfig();

            // Parse the JWT token
            $token = $jwtConfig->parser()->parse($tokenString);

            // Define validation constraints
            $constraints = [
                new SignedWith($jwtConfig->signer(), $jwtConfig->signingKey()),
                new IssuedBy('http://localhost'),
                new PermittedFor('http://localhost:5173'),
                new ValidAt(SystemClock::fromUTC()),
            ];

            // Validate token
            $jwtConfig->validator()->assert($token, ...$constraints);

            // Instead of using claims(), directly fetch the UID from UserService
            $userId = $this->userService->getUserIdFromToken($token);

            if (!$userId) {
                return response()->json(['message' => 'Invalid token data'], 401);
            }

            // Fetch the user from the database using the user ID
            $user = User::find($userId); // Add this line to fetch the User model

            if (!$user) { // Add this check in case user is not found
                return response()->json(['message' => 'Invalid user associated with token'], 401);
            }

            // Set the authenticated user on the request so that $request->user() works
            $request->setUserResolver(function () use ($user) { // Use setUserResolver
                return $user;
            });


            // Continue with the request
            return $next($request);
        } catch (RequiredConstraintsViolated $e) {
            return response()->json(['message' => 'Invalid token', 'error' => $e->getMessage()], 401);
        } catch (Exception $e) {
            return response()->json(['message' => 'Unauthorized', 'error' => $e->getMessage()], 401);
        }
    }
}
