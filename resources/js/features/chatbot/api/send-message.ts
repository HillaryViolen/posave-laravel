import axios from 'axios';
import type { ChatResponse } from '../types';

export async function sendMessageToServer(message: string, conversationId: number | null): Promise<ChatResponse> {
    const res = await axios.post<ChatResponse>('/ai/chat', {
        message,
        conversation_id: conversationId,
    });
    return res.data;
}