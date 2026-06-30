import { DashboardSidebarLayout } from '@/layouts';
import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export const DashboardLayout = ({ children, title, description }: AppLayoutProps) => (
    <DashboardSidebarLayout title={title} description={description}>
        {children}
    </DashboardSidebarLayout>
);
