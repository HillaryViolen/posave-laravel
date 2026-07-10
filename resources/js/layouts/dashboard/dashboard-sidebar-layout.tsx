import { AppContent, AppShell, AppSidebar, AppSidebarHeader } from '@/components';
import { branchManagerNavItems, cashierNavItems, liteNavItems, mainNavItems } from '@/data';
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

interface AuthShared {
    user: AuthUser;
    company_type?: string;
}

function getNavItemsForRole(role: string, companyType?: string): NavItem[] {
    if (companyType === 'lite') {
        return liteNavItems; // ← company type dicek DULUAN, sebelum role
    }

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
    const { auth } = usePage<{ auth: AuthShared }>().props;
    const navItems = getNavItemsForRole(auth.user.role, auth.company_type);

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
