import axios from 'axios';

export async function deleteConversation(conversationId: number): Promise<void> {
    await axios.delete(`/chatbot/conversations/${conversationId}`);
}