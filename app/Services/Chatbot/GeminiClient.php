<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
  private const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
  private const MODEL = 'gemini-3.5-flash';

  public function create(array|string $input, ?string $systemInstruction, array $tools, ?string $previousInteractionId = null): ?array
  {
    $payload = [
      'model' => self::MODEL,
      'input' => $input,
      'generation_config' => ['thinking_level' => 'low'],
    ];

    if ($systemInstruction) {
      $payload['system_instruction'] = $systemInstruction;
    }
    if (!empty($tools)) {
      $payload['tools'] = $tools;
    }
    if ($previousInteractionId) {
      $payload['previous_interaction_id'] = $previousInteractionId;
    }

    $response = Http::withHeaders(['x-goog-api-key' => env('GEMINI_API_KEY')])
      ->connectTimeout(5)
      ->timeout(45)
      ->post(self::INTERACTIONS_URL, $payload);

    if (!$response->successful()) {
      Log::error('Gemini API request gagal', [
        'status' => $response->status(),
        'body' => $response->json() ?? $response->body(),
        'payload_sent' => $payload,
      ]);
      return null;
    }

    return $response->json();
  }
}
