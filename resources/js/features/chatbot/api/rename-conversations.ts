import axios from 'axios';

export async function renameConversation(conversationId: number, title: string): Promise<void> {
    await axios.patch(`/chatbot/conversations/${conversationId}`, { title });
}