import { SidebarTrigger } from '@/components';
import { Button } from '@/components/ui';
import { useChatbot } from '@/features/chatbot';
import { MessageSquare } from 'lucide-react';

interface AppSidebarHeaderProps {
    title?: string;
    description?: string;
}

export function AppSidebarHeader({ title, description }: AppSidebarHeaderProps) {
    const { open } = useChatbot();
    return (
        <header className="border-sidebar-border/50 bg-background/95 sticky top-0 z-[5] border-b backdrop-blur">
            <div className="flex items-start justify-between px-6 py-4">
                <div className="flex items-start gap-4">
                    <SidebarTrigger className="mt-1" />

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>

                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                    </div>
                </div>

                <Button
                    onClick={open}
                    variant="outline"
                    className="h-10 rounded-md border-blue-200 bg-white text-[#003399] shadow-sm hover:bg-blue-50"
                >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Tanya Temanmu
                </Button>
            </div>
        </header>
    );
}
