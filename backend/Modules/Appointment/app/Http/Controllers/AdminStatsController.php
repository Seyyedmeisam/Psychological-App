<?php

namespace Modules\Appointment\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Appointment\Services\AdminStatsService;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function __invoke(AdminStatsService $stats): JsonResponse
    {
        return response()->json([
            'data' => $stats->summary(),
        ]);
    }
}
