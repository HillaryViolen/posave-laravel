import { AppContent, AppShell, AppSidebar, AppSidebarHeader } from '@/components';
import { branchManagerNavItems, cashierNavItems, mainNavItems } from '@/data';
import { Chatbot } from '@/features/chatbot';
import type { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface DashboardSidebarLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

interface AuthUser {
    role: string;
}

function getNavItemsForRole(role: string): NavItem[] {
    switch (role) {
        case 'branch_manager':
            return branchManagerNavItems;
        case 'cashier':
            return cashierNavItems;
        case 'owner':
        default:
            return mainNavItems;
    }
}

export function DashboardSidebarLayout({ children, title, description }: DashboardSidebarLayoutProps) {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const navItems = getNavItemsForRole(auth.user.role);

    return (
        <AppShell variant="sidebar">
            <AppSidebar items={navItems} />

            <AppContent variant="sidebar">
                <AppSidebarHeader title={title} description={description} />

                {children}

                <Chatbot />
            </AppContent>
        </AppShell>
    );
}
