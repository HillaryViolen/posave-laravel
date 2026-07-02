<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use App\Models\Chatbot\Chatbot;
use App\Models\Chatbot\ChatbotMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiChatbotController extends Controller
{
    private const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
    private const MODEL = 'gemini-3.5-flash';

    /**
     * GET /chatbot/conversations
     * Daftar semua room chat milik user, buat sidebar.
     */
    public function listConversations(Request $request)
    {
        $conversations = Chatbot::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'updated_at']);

        return response()->json($conversations);
    }

    /**
     * GET /chatbot/conversations/{chatbot}/messages
     * Semua pesan dalam satu room, buat ditampilin pas room diklik.
     */
    public function getMessages(Request $request, Chatbot $chatbot)
    {
        abort_if($chatbot->user_id !== $request->user()->id, 403);

        return response()->json(
            $chatbot->messages()->orderBy('created_at')->get(['role', 'content'])
        );
    }

    /**
     * POST /ai/chat
     * Endpoint utama: kirim pesan, dapat balasan AI.
     */
    public function handle(Request $request)
    {
        $message = $request->input('message');
        $chatbotId = $request->input('conversation_id');

        if (!$chatbotId) {
            $chatbot = Chatbot::create([
                'user_id' => $request->user()->id,
                'title' => Str::limit($message, 40),
            ]);
        } else {
            $chatbot = Chatbot::findOrFail($chatbotId);
            abort_if($chatbot->user_id !== $request->user()->id, 403);
        }

        ChatbotMessage::create([
            'chatbot_id' => $chatbot->id,
            'role' => 'user',
            'content' => $message,
        ]);

        $result = null;

        if ($chatbot->last_interaction_id) {
            $result = $this->tryContinueInteraction($message, $chatbot->last_interaction_id);
        }

        if (!$result) {
            $result = $this->fallbackWithFullHistory($chatbot, $message);
        }

        ChatbotMessage::create([
            'chatbot_id' => $chatbot->id,
            'role' => 'assistant',
            'content' => $result['reply'],
        ]);

        $chatbot->update(['last_interaction_id' => $result['interaction_id']]);
        $chatbot->touch();

        return response()->json([
            'reply' => $result['reply'],
            'conversation_id' => $chatbot->id,
        ]);
    }

    private function tryContinueInteraction(string $message, string $previousInteractionId): ?array
    {
        $response = Http::withHeaders([
            'x-goog-api-key' => env('GEMINI_API_KEY'),
        ])->post(self::INTERACTIONS_URL, [
            'model' => self::MODEL,
            'input' => $message,
            'previous_interaction_id' => $previousInteractionId,
        ]);

        if (!$response->successful()) {
            Log::warning('Interaction lanjutan gagal, kemungkinan expired', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            return null;
        }

        return $this->extractReply($response->json());
    }

    private function fallbackWithFullHistory(Chatbot $chatbot, string $latestMessage): array
    {
        $history = $chatbot->messages()->orderBy('created_at')->get();

        $input = $history->map(function ($msg) {
            return [
                'type' => $msg->role === 'assistant' ? 'model_output' : 'user_input',
                'content' => [
                    ['type' => 'text', 'text' => $msg->content],
                ],
            ];
        })->toArray();

        $response = Http::withHeaders([
            'x-goog-api-key' => env('GEMINI_API_KEY'),
        ])->post(self::INTERACTIONS_URL, [
            'model' => self::MODEL,
            'input' => $input,
        ]);

        if (!$response->successful()) {
            Log::error('Fallback ke Gemini API juga gagal', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return [
                'reply' => 'Maaf, terjadi kesalahan saat menghubungi AI.',
                'interaction_id' => null,
            ];
        }

        return $this->extractReply($response->json());
    }

    private function extractReply(array $data): array
    {
        $reply = 'Maaf, terjadi kesalahan.';

        foreach ($data['steps'] ?? [] as $step) {
            if ($step['type'] === 'model_output') {
                foreach ($step['content'] ?? [] as $block) {
                    if ($block['type'] === 'text') {
                        $reply = $block['text'];
                        break 2;
                    }
                }
            }
        }

        return [
            'reply' => $reply,
            'interaction_id' => $data['id'] ?? null,
        ];
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

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $chatbot->update(['title' => $request->input('title')]);

        return response()->json(['success' => true, 'title' => $chatbot->title]);
    }
}
