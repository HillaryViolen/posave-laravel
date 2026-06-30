import { useChatbot } from '@/features/chatbot';
import { Bot, X } from 'lucide-react';

export function ChatHeader() {
    const { close } = useChatbot();

    return (
        <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center">
                <Bot className="mr-3 h-6 w-6 text-blue-600" />

                <div>
                    <h2 className="font-semibold text-slate-900">Robot Pintar</h2>

                    <p className="text-xs text-slate-500">POSAVE AI Assistant</p>
                </div>
            </div>

            <button aria-label="close" onClick={close} className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
