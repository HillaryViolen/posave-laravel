<?php

use App\Http\Controllers\Chatbot\AiChatbotController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth')->group(function () {
  Route::post('/ai/chat', [AiChatbotController::class, 'handle']);
  Route::get('/chatbot/conversations', [AiChatbotController::class, 'listConversations']);
  Route::get('/chatbot/conversations/{chatbot}/messages', [AiChatbotController::class, 'getMessages']);
  Route::delete('/chatbot/conversations/{chatbot}', [AiChatbotController::class, 'deleteConversation']);
  Route::patch('/chatbot/conversations/{chatbot}', [AiChatbotController::class, 'renameConversation']);
});
