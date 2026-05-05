import { DashboardSidebarLayout } from '@/layouts';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export const DashboardLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <DashboardSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </DashboardSidebarLayout>
);
