import { AskChatbotButton, SidebarTrigger } from '@/components';
import { useChatbot } from '@/features/chatbot';

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

                <AskChatbotButton className="ml-auto" />
            </div>
        </header>
    );
}
