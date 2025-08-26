<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getUserProfile()
    {
        try {
            $user = request()->user();

            if (!$user) {
                return response()->json(['message' => 'Unauthorized - No user found'], 401);
            }

            Log::info('Profile requested for user ID: ' . $user->id);

            return response()->json([
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'address' => $user->address ?? 'Not provided',
                'role' => $user->role,
                'profile_image' => $user->profile_image,
                'profile_image_url' => $user->profile_image_url, // Use the accessor
                'name_changed_at' => $user->name_changed_at,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Profile fetch error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = request()->user();

            if (!$user) {
                return response()->json(['message' => 'Unauthorized - No user found'], 401);
            }

            // Enhanced validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'address' => 'nullable|string|max:1000',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Added webp support
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [];
            $nameUpdated = false;

            // Handle name update with proper validation
            if ($request->has('name') && $request->name !== $user->name) {
                if ($user->name_changed_at) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Name can only be changed once in a lifetime'
                    ], 400);
                }
                
                $updateData['name'] = trim($request->name);
                $updateData['name_changed_at'] = now();
                $nameUpdated = true;
                Log::info('Name updated for user ID: ' . $user->id);
            }

            // Handle address update
            if ($request->has('address')) {
                $updateData['address'] = $request->address ? trim($request->address) : null;
                Log::info('Address updated for user ID: ' . $user->id);
            }

            // Handle profile image update with better error handling
            if ($request->hasFile('profile_image')) {
                try {
                    // Ensure the profiles directory exists
                    if (!Storage::disk('public')->exists('profiles')) {
                        Storage::disk('public')->makeDirectory('profiles');
                    }

                    // Delete old image if exists
                    if ($user->profile_image && Storage::disk('public')->exists('profiles/' . $user->profile_image)) {
                        Storage::disk('public')->delete('profiles/' . $user->profile_image);
                        Log::info('Old profile image deleted for user ID: ' . $user->id);
                    }

                    // Store new image with better naming
                    $image = $request->file('profile_image');
                    $extension = $image->getClientOriginalExtension();
                    $imageName = 'profile_' . $user->id . '_' . time() . '.' . $extension;
                    
                    $path = $image->storeAs('profiles', $imageName, 'public');
                    
                    if ($path) {
                        $updateData['profile_image'] = $imageName;
                        Log::info('Profile image updated for user ID: ' . $user->id . ' - New file: ' . $imageName);
                    } else {
                        throw new \Exception('Failed to store image');
                    }
                } catch (\Exception $e) {
                    Log::error('Image upload error for user ID: ' . $user->id . ' - ' . $e->getMessage());
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload image: ' . $e->getMessage()
                    ], 500);
                }
            }

            // Update user data if there are changes
            if (!empty($updateData)) {
                $updated = $user->update($updateData);
                
                if (!$updated) {
                    throw new \Exception('Failed to update user data in database');
                }
                
                // Refresh the user model
                $user = $user->fresh();
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'name_updated' => $nameUpdated,
                'user' => [
                    'name' => $user->name,
                    'address' => $user->address,
                    'profile_image' => $user->profile_image,
                    'profile_image_url' => $user->profile_image_url,
                    'name_changed_at' => $user->name_changed_at,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}