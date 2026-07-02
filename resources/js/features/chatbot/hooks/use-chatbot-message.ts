import { useState } from 'react';
import { getConversations, getMessages, sendMessageToServer } from '@/features/chatbot/api';
import type { Conversation, Message } from '../types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isWaitingReply, setIsWaitingReply] = useState(false);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Gagal memuat daftar percakapan:', error);
        }
    };

    const selectConversation = async (conversationId: number) => {
        setActiveConversationId(conversationId);
        setIsLoadingHistory(true);

        try {
            const data = await getMessages(conversationId);
            setMessages(data);
        } catch (error) {
            console.error('Gagal memuat pesan:', error);
            setMessages([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const startNewConversation = () => {
        setActiveConversationId(null);
        setMessages([]);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isWaitingReply) return;

        setMessages((prev) => [...prev, { role: 'user', content: text }]);
        setIsWaitingReply(true);

        try {
            const { reply, conversation_id } = await sendMessageToServer(text, activeConversationId);

            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

            if (!activeConversationId) {
                setActiveConversationId(conversation_id);
            }

            await loadConversations();
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi.' }]);
        } finally {
            setIsWaitingReply(false);
        }
    };

    return {
        messages,
        conversations,
        activeConversationId,
        isLoadingHistory,
        isWaitingReply,
        sendMessage,
        loadConversations,
        selectConversation,
        startNewConversation,
    };
}