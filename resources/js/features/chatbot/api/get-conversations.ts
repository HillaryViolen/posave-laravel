import type { Conversation } from '../types';

export async function getConversations(): Promise<Conversation[]> {
    const res = await fetch('/chatbot/conversations', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
}