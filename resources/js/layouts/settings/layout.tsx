import { Button, Heading, Separator } from '@/components';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { GroupIcon } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        routeName: 'settings.profile.edit',
        icon: GroupIcon,
    },
    {
        title: 'Password',
        routeName: 'settings.password.edit',
        icon: GroupIcon,
    },
    {
        title: 'Appearance',
        routeName: 'settings.appearance',
        icon: GroupIcon,
    },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
    const isActive = (routeName?: string) => {
        if (!routeName) return false;

        return route().current(routeName);
    };
    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.routeName}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isActive(item.routeName),
                                })}
                            >
                                <Link href={route(item.routeName!)} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
