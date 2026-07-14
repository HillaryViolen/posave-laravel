<?php

namespace App\Models\Chatbot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ChatbotMessage extends Model
{
    use HasFactory;

    protected $fillable = ['chatbot_id', 'role', 'content'];

    public function chatbot(): BelongsTo
    {
        return $this->belongsTo(Chatbot::class);
    }
    public function action(): HasOne
    {
        return $this->hasOne(ChatbotAction::class);
    }
}
