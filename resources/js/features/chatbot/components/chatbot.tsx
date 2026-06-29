import { ChatBody, ChatHeader, ChatHistory, ChatInput } from '@/features/chatbot/components';

import { useChatbot } from '@/features/chatbot';

export function Chatbot() {
    const { isOpen, close } = useChatbot();

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={close} />

            <div className="fixed top-0 right-0 z-50 flex h-screen w-[900px] border-l bg-white shadow-2xl">
                <ChatHistory />

                <div className="flex flex-1 flex-col">
                    <ChatHeader />

                    <ChatBody />

                    <ChatInput />
                </div>
            </div>
        </>
    );
}
