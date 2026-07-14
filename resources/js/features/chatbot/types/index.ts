export interface Message {
    role: 'user' | 'assistant';
    content: string;
    action?: PendingAction | null;
    form?: PendingForm | null;
}

export interface PendingAction {
    id: number;
    tool_name: string;
    summary: Record<string, unknown>;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    required: boolean;
    value: string | number;
    options?: string[];
}

export interface PendingForm {
    tool_name: string;
    fields: FormField[];
}

export interface ChatResponse {
    reply: string;
    conversation_id: number;
    action: PendingAction | null;
    form: PendingForm | null;
}

export interface Conversation {
    id: number;
    title: string;
    updated_at: string;
}