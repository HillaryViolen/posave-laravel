import { Bot } from 'lucide-react';
import type { Message } from '../types';

interface ChatBodyProps {
    messages: Message[];
    isLoadingHistory: boolean;
    isWaitingReply: boolean;
}

export function ChatBody({ messages, isLoadingHistory, isWaitingReply }: ChatBodyProps) {
    if (isLoadingHistory) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">Memuat percakapan...</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center px-6">
                <div className="text-center">
                    <Bot className="mx-auto h-14 w-14 text-blue-600 sm:h-16 sm:w-16" />
                    <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Halo 👋</h1>
                    <p className="mt-3 text-sm text-slate-500 sm:text-base">
                        Saya Robot Pintar POSAVE
                        <br />
                        Ada yang bisa saya bantu?
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 overflow-auto p-4 sm:p-6">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 sm:max-w-[70%] ${
                            msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'
                        }`}
                    >
                        {msg.role === 'assistant' ? (
                            <div className="prose prose-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none">{msg.content}</div>
                        ) : (
                            msg.content
                        )}
                    </div>
                </div>
            ))}

            {isWaitingReply && (
                <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-slate-100 px-4 py-2 text-slate-500 sm:max-w-[70%]">Mengetik...</div>
                </div>
            )}
        </div>
    );
}
