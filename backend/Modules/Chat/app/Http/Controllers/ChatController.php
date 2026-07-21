<?php

namespace Modules\Chat\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Chat\Http\Requests\StoreConversationRequest;
use Modules\Chat\Http\Requests\StoreMessageRequest;
use Modules\Chat\Http\Resources\ChatUserResource;
use Modules\Chat\Http\Resources\ConversationResource;
use Modules\Chat\Http\Resources\MessageResource;
use Modules\Chat\Services\ChatService;
use Modules\User\Models\User;

class ChatController extends Controller
{
    public function __construct(private readonly ChatService $chat) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => ConversationResource::collection(
                $this->chat->listConversations($user),
            ),
        ]);
    }

    public function people(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => ChatUserResource::collection(
                $this->chat->listPeople($user, $request->string('search')->toString() ?: null),
            ),
        ]);
    }

    public function store(StoreConversationRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $conversation = $this->chat->findOrCreate(
            $user,
            (int) $request->validated('user_id'),
        );
        $conversation->load([
            'lowUser:id,name,role,avatar',
            'highUser:id,name,role,avatar',
            'latestMessage',
        ]);

        return response()->json([
            'data' => new ConversationResource($conversation),
        ], 201);
    }

    public function messages(Request $request, int $conversation): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $model = $this->chat->getConversationFor($user, $conversation);
        $afterId = $request->integer('after_id') ?: null;

        return response()->json([
            'data' => MessageResource::collection(
                $this->chat->listMessages($model, $afterId),
            ),
        ]);
    }

    public function send(StoreMessageRequest $request, int $conversation): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $model = $this->chat->getConversationFor($user, $conversation);

        $message = $this->chat->sendMessage(
            $user,
            $model,
            $request->validated('body'),
            $request->file('attachment'),
        );

        return response()->json([
            'data' => new MessageResource($message),
        ], 201);
    }
}
