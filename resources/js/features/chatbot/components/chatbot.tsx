import { ChatBody, ChatHeader, ChatHistory, ChatInput } from '@/features/chatbot/components';
import { useChatMessages, useChatbot } from '@/features/chatbot/hooks';
import { useEffect } from 'react';

export function Chatbot() {
    const { isOpen, close } = useChatbot();
    const {
        messages,
        conversations,
        activeConversationId,
        isLoadingHistory,
        isWaitingReply,
        sendMessage,
        loadConversations,
        selectConversation,
        startNewConversation,
    } = useChatMessages();

    useEffect(() => {
        if (isOpen) {
            loadConversations();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={close} />

            <div className="fixed top-0 right-0 z-50 flex h-screen w-[900px] border-l bg-white shadow-2xl">
                <ChatHistory
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelect={selectConversation}
                    onNewChat={startNewConversation}
                    onListChanged={loadConversations}
                />

                <div className="flex flex-1 flex-col">
                    <ChatHeader />
                    <ChatBody messages={messages} isLoadingHistory={isLoadingHistory} isWaitingReply={isWaitingReply} />
                    <ChatInput onSend={sendMessage} isLoading={isWaitingReply} />
                </div>
            </div>
        </>
    );
}
