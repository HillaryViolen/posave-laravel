import { AppContent, AppHeader, AppFooter, AppShell } from '@/components';
import { type BreadcrumbItem } from '@/types';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeaderLayout({ children, breadcrumbs }: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <div className="flex min-h-screen flex-col">
                <AppHeader breadcrumbs={breadcrumbs} />
                
                <main className="flex-1">
                    <AppContent>{children}</AppContent>
                </main>
                
                <AppFooter />
            </div>
        </AppShell>
    );
}