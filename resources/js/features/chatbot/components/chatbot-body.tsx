import { Bot } from 'lucide-react';

export function ChatBody() {
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
