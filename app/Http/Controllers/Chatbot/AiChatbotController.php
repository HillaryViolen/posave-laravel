<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use App\Models\Chatbot\Chatbot;
use App\Models\Chatbot\ChatbotAction;
use App\Models\User;
use App\Services\Chatbot\ChatbotService;
use App\Services\Chatbot\ToolRegistry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AiChatbotController extends Controller
{
    public function __construct(private ChatbotService $chatbotService) {}

    public function listConversations(Request $request)
    {
        $conversations = Chatbot::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'updated_at']);

        return response()->json($conversations);
    }

    public function getMessages(Request $request, Chatbot $chatbot)
    {
        abort_if($chatbot->user_id !== $request->user()->id, 403);

        $messages = $chatbot->messages()
            ->with('action:id,chatbot_message_id,tool_name,summary,status')
            ->orderBy('created_at')
            ->get(['id', 'role', 'content']);

        return response()->json($messages->map(fn($m) => [
            'role' => $m->role,
            'content' => $m->content,
            'action' => $m->action,
        ]));
    }

    public function handle(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|integer|exists:chatbots,id',
        ]);

        /** @var User $user */
        $user = $request->user();

        if (!$validated['conversation_id']) {
            $chatbot = Chatbot::create([
                'user_id' => $user->id,
                'title' => Str::limit($validated['message'], 40),
            ]);
        } else {
            $chatbot = Chatbot::findOrFail($validated['conversation_id']);
            abort_if($chatbot->user_id !== $user->id, 403);
        }

        return response()->json($this->chatbotService->reply($user, $chatbot, $validated['message']));
    }

    public function confirmAction(Request $request, ChatbotAction $action)
    {
        /** @var User $user */
        $user = $request->user();

        abort_if($action->chatbot->user_id !== $user->id, 403);
        abort_if($action->status !== 'pending', 422, 'Aksi ini sudah diputuskan sebelumnya.');

        $tool = ToolRegistry::find($action->tool_name, $user);
        abort_if(!$tool, 403);

        try {
            $result = $tool->execute($user, $action->payload);
            $action->update(['status' => 'confirmed', 'result' => $result]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Gagal menjalankan aksi: ' . $e->getMessage()], 422);
        }

        return response()->json(['status' => 'confirmed', 'result' => $result]);
    }

    public function cancelAction(Request $request, ChatbotAction $action)
    {
        /** @var User $user */
        $user = $request->user();

        abort_if($action->chatbot->user_id !== $user->id, 403);
        abort_if($action->status !== 'pending', 422);

        $action->update(['status' => 'cancelled']);

        return response()->json(['status' => 'cancelled']);
    }

    public function deleteConversation(Request $request, Chatbot $chatbot)
    {
        abort_if($chatbot->user_id !== $request->user()->id, 403);
        $chatbot->delete();
        return response()->json(['success' => true]);
    }

    public function renameConversation(Request $request, Chatbot $chatbot)
    {
        abort_if($chatbot->user_id !== $request->user()->id, 403);
        $request->validate(['title' => 'required|string|max:255']);
        $chatbot->update(['title' => $request->input('title')]);

        return response()->json(['success' => true, 'title' => $chatbot->title]);
    }
    public function submitForm(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'required|integer|exists:chatbots,id',
            'tool_name' => 'required|string',
            'args' => 'required|array',
        ]);

        /** @var User $user */
        $user = $request->user();

        $chatbot = Chatbot::where('id', $validated['conversation_id'])->where('user_id', $user->id)->firstOrFail();

        $tool = ToolRegistry::find($validated['tool_name'], $user);
        abort_if(!$tool, 403);

        $summary = $tool->summarize($user, $validated['args']);

        $action = \App\Models\Chatbot\ChatbotAction::create([
            'chatbot_id' => $chatbot->id,
            'tool_name' => $tool->name(),
            'payload' => $validated['args'],
            'summary' => $summary,
            'status' => 'pending',
        ]);

        $assistantMessage = \App\Models\Chatbot\ChatbotMessage::create([
            'chatbot_id' => $chatbot->id,
            'role' => 'assistant',
            'content' => 'Berikut ringkasan yang akan disimpan:',
        ]);
        $action->update(['chatbot_message_id' => $assistantMessage->id]);
        $chatbot->touch();

        return response()->json([
            'reply' => $assistantMessage->content,
            'conversation_id' => $chatbot->id,
            'action' => [
                'id' => $action->id,
                'tool_name' => $action->tool_name,
                'summary' => $action->summary,
                'status' => $action->status,
            ],
            'form' => null,
        ]);
    }
}
