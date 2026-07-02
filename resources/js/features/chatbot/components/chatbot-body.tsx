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
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <Bot className="mx-auto h-16 w-16 text-blue-600" />
                    <h1 className="mt-6 text-3xl font-bold">Halo 👋</h1>
                    <p className="mt-3 text-slate-500">
                        Saya Robot Pintar POSAVE
                        <br />
                        Ada yang bisa saya bantu?
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 overflow-auto p-6">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
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
                    <div className="max-w-[70%] rounded-2xl bg-slate-100 px-4 py-2 text-slate-500">Mengetik...</div>
                </div>
            )}
        </div>
    );
}
