import axios from 'axios';
import type { Conversation } from '../types';

export async function getConversations(): Promise<Conversation[]> {
    const res = await axios.get<Conversation[]>('/chatbot/conversations');
    return res.data;
}