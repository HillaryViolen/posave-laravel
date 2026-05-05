import { Head } from '@inertiajs/react';

import { HeadingSmall } from '@/components';
import { type BreadcrumbItem } from '@/types';
import { AppearanceTabs } from '../components';

import { DashboardLayout, SettingsLayout } from '@/layouts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <DashboardLayout>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
