<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    //
     //Register any application services, such as custom services you want to provide, like EmailService, UsersService etc.
     //
     //@return void

    //public function register()
    //{
        //
    //}

    ///
     //Bootstrap any application services.
    //
     // @return void
     //
    public function boot()
    {
        try {
            DB::connection()->getPdo();
            Log::info('Database connection established');
        } catch (\Exception $e) {
            Log::error('Database connection failed: ' . $e->getMessage());
        }
    }
}
