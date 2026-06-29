import { AppContent, AppShell, AppSidebar, AppSidebarHeader } from '@/components';
import { Chatbot } from '@/features/chatbot';
import { ReactNode } from 'react';

interface DashboardSidebarLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export function DashboardSidebarLayout({ children, title, description }: DashboardSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />

            <AppContent variant="sidebar">
                <AppSidebarHeader title={title} description={description} />

                {children}

                <Chatbot />
            </AppContent>
        </AppShell>
    );
}
