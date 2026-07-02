export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    reply: string;
    conversation_id: number;
}

export interface Conversation {
    id: number;
    title: string;
    updated_at: string;
}