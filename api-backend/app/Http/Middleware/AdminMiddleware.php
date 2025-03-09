<?php

namespace App\Http\Middleware; // Keep this namespace declaration - it's where Laravel expects to find this middleware

use Closure; // Keep this - it's needed for middleware 'next' functionality
use Illuminate\Http\Request; // Keep this - for type hinting the incoming request
use Illuminate\Support\Facades\Auth; // Keep this -  the Auth facade to access authentication services

class AdminMiddleware // Keep this class name - AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request // Keep this parameter - the incoming HTTP request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next // Keep this parameter -  the 'next' middleware or route handler in the pipeline
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse // Keep this return type declaration - specifies what the middleware can return
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Check if the user is authenticated at all.
        //    We use Auth::check() to see if there is an authenticated user in the current session/request.
        if (!Auth::check()) {
            // If NOT authenticated (no user logged in), return a 401 Unauthorized response.
            // 401 means "authentication is required and has failed or has not yet been provided."
            return response()->json(['error' => 'Unauthorized - Not authenticated'], 401);
            // For an API, returning a JSON response with an error code is appropriate.
            // If this were a web application, you might redirect to a login page instead.
        }

        // 2. If authenticated, get the authenticated user object.
        //    Auth::user() retrieves the currently authenticated user instance.
        $user = Auth::user();

        // 3. Check if the authenticated user has the 'admin' role.
        //    We access the 'role' property of the $user object and compare it to 'admin'.
        //    **Important:** Make sure your users table has a 'role' column and that admin users have 'admin' stored in this column (case-sensitive).
        if ($user->role !== 'admin') {
            // If the user's role is NOT 'admin', they are not authorized to access this admin route.
            // Return a 403 Forbidden response.
            // 403 means "the request was valid and understood by the server, but the server is refusing to take further action." - in this case, because of insufficient permissions (not being an admin).
            return response()->json(['error' => 'Unauthorized - Admin role required'], 403);
            // Again, for an API, a JSON error response is suitable.
        }

        // 4. If both authentication AND role check are successful, allow the request to proceed.
        //    $next($request) passes the request to the next middleware in the chain or to the route handler (ProductController@store in your case).
        return $next($request); // **Keep this line - it's essential to continue processing the request if authorized!**
    }
}
