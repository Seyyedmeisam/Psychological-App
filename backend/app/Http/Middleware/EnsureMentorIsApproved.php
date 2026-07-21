<?php

namespace App\Http\Middleware;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMentorIsApproved
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (
            ! $user
            || $user->role !== UserRole::Mentor
            || $user->mentor_verification_status !== MentorVerificationStatus::Approved
        ) {
            abort(403, 'Mentor account is not verified yet.');
        }

        return $next($request);
    }
}
