import { Breadcrumbs } from '@/components';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { useInitials } from '@/hooks';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Tentang Kami',
        routeName: 'home',
    },
    {
        title: 'Layanan',
        routeName: 'service.index',
    },
    {
        title: 'Artikel',
        routeName: 'artikel.index',
    },
    {
        title: 'FAQ',
        routeName: 'faq',
    },
    {
        title: 'Hubungi Kami',
        routeName: 'contact-us.index',
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const getInitials = useInitials();

    const isActive = (routeName: string) => {
        if (!routeName) return false;

        return route().current(routeName);
    };

    const getHref = (item: NavItem) => {
        if (item.routeName) {
            return route(item.routeName);
        }

        return item.url ?? '#';
    };

    console.log(page);

    return (
        <>
            <div className="sticky top-0 z-100 mx-auto w-full max-w-7xl px-8 pt-4 md:px-16">
                <div className="flex h-16 w-full items-center justify-between rounded-full bg-[#F2F3F5] px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* MOBILE MENU */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6 flex h-full flex-col space-y-4">
                                        <div className="flex flex-col space-y-4 text-sm">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={getHref(item)}
                                                    className={`font-medium transition-colors ${
                                                        isActive(item.routeName) ? 'font-semibold text-[#253342]' : 'hover:text-slate-600'
                                                    }`}
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* LOGO */}
                        <Link href={route('home')} className="flex items-center">
                            <img src="/assets/landing-page/logo.png" alt="POSAVE" className="ml-5 h-[34px] w-auto scale-350" />
                        </Link>
                    </div>

                    {/* CENTER MENU */}
                    <div className="ml-25 hidden items-center gap-10 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={getHref(item)}
                                className={`transition-colors ${
                                    isActive(item.routeName) ? 'font-semibold text-[#253342]' : 'text-slate-700 hover:text-slate-500'
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT BUTTON */}
                    <div className="hidden items-center space-x-4 lg:flex">
                        {auth?.user ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-[44px] rounded-[10px] border-[#233246] px-6 text-[15px] font-semibold text-[#233246]"
                                    asChild
                                >
                                    <Link href={route('dashboard.index')}>Dashboard</Link>
                                </Button>

                                <Button
                                    className="h-[44px] rounded-[10px] bg-[#233246] px-6 text-[15px] font-semibold text-white hover:bg-[#1b2736]"
                                    asChild
                                >
                                    <Link href={route('logout')} method="post">
                                        Logout
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-[44px] rounded-[10px] border-[#233246] px-6 text-[15px] font-semibold text-[#233246]"
                                    asChild
                                >
                                    <Link href={route('register')}>Daftar</Link>
                                </Button>

                                <Button
                                    className="h-[44px] rounded-[10px] bg-[#233246] px-6 text-[15px] font-semibold text-white hover:bg-[#1b2736]"
                                    asChild
                                >
                                    <Link href={route('login')}>Masuk</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* BREADCRUMBS */}
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 mt-4 border-b">
                    <div className="mx-auto flex h-12 w-full items-center px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
