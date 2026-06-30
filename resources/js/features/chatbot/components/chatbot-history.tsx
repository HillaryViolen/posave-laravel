import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';

export function ChatHistory() {
    return (
        <aside className="flex w-72 flex-col border-r bg-slate-50">
            <div className="flex h-16 items-center border-b px-4">
                <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Chat Baru
                </Button>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="px-4 py-3 text-xs font-semibold text-slate-400">Hari Ini</div>

                {[1, 2, 3].map((i) => (
                    <button key={i} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-100">
                        <MessageSquare size={16} />

                        <span className="truncate">Purchase Order #{i}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}
