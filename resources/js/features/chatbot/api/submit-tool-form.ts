import axios from 'axios';
import type { ChatResponse } from '../types';

export async function submitToolForm(conversationId: number, toolName: string, args: Record<string, unknown>): Promise<ChatResponse> {
    const res = await axios.post<ChatResponse>('/ai/tools/submit', {
        conversation_id: conversationId,
        tool_name: toolName,
        args,
    });
    return res.data;
}
