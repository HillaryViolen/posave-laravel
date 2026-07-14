<?php

namespace App\Models\Chatbot;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatbotAction extends Model
{
  protected $fillable = ['chatbot_id', 'chatbot_message_id', 'tool_name', 'payload', 'summary', 'status', 'result'];

  protected $casts = [
    'payload' => 'array',
    'summary' => 'array',
    'result' => 'array',
  ];

  public function chatbot(): BelongsTo
  {
    return $this->belongsTo(Chatbot::class);
  }
}
