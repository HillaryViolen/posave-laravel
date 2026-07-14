import { useState } from 'react';
import axios from 'axios';   
import { getConversations, getMessages, sendMessageToServer } from '@/features/chatbot/api';
import type { Conversation, Message, PendingAction } from '../types';

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
            const { reply, conversation_id, action, form } = await sendMessageToServer(text, activeConversationId);

            setMessages((prev) => [...prev, { role: 'assistant', content: reply, action, form }]);

            if (!activeConversationId) {
                setActiveConversationId(conversation_id);
            }

            await loadConversations();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Chat error (pesan asli dari server):', error.response.data);
            } else {
                console.error('Chat error:', error);
            }
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi.' }]);
        } finally {
            setIsWaitingReply(false);
        }
    };

    const appendAssistantMessage = (content: string, action: PendingAction | null) => {
        setMessages((prev) => [...prev, { role: 'assistant', content, action }]);
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
        appendAssistantMessage,
    };
}