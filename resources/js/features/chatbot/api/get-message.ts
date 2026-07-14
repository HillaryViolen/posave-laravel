import axios from 'axios';
import type { Message } from '../types';

export async function getMessages(conversationId: number): Promise<Message[]> {
    const res = await axios.get<Message[]>(`/chatbot/conversations/${conversationId}/messages`);
    return res.data;
}