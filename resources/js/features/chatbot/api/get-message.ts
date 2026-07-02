import type { Message } from '../types';

export async function getMessages(conversationId: number): Promise<Message[]> {
    const res = await fetch(`/chatbot/conversations/${conversationId}/messages`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
}