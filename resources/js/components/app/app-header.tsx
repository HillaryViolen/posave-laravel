import { AppLogo, AppLogoIcon, Breadcrumbs } from '@/components';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react'; // Tambahkan ChevronDown untuk ikon bahasa

// 1. Ubah daftar menu sesuai Figma
const mainNavItems: NavItem[] = [
    { title: 'Tentang Kami', url: '/tentang-kami' },
    { title: 'Layanan', url: '/layanan' },
    { title: 'Artikel', url: '/artikel' },
    { title: 'FAQ', url: '/faq' },
    { title: 'Hubungi Kami', url: '/hubungi-kami' },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <>
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-8">
                <div className="flex h-16 w-full items-center justify-between rounded-full bg-[#F2F3F5] px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                    <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    </SheetHeader>
                                    <div className="mt-6 flex h-full flex-1 flex-col space-y-4">
                                        <div className="flex flex-col space-y-4 text-sm">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.url} className="font-medium hover:text-slate-600">
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href={auth.user ? '/dashboard' : '/'} prefetch className="flex items-center">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* --- TENGAH: MENU DESKTOP --- */}
                    <div className="hidden flex-1 items-center justify-center space-x-8 text-sm font-medium text-slate-800 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link key={item.title} href={item.url} className="transition-colors hover:text-slate-500">
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    className="rounded-md border-slate-800 px-6 hover:bg-slate-100 hover:text-slate-800"
                                    asChild
                                >
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                                <Button className="rounded-md bg-[#253342] px-6 text-white hover:bg-[#1a2530]" asChild>
                                    <Link method="post" href={route('logout')}>
                                        Logout
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" className="rounded-md border-slate-800 px-6 text-slate-800 hover:bg-slate-100" asChild>
                                    <Link href="/register">Daftar</Link>
                                </Button>
                                <Button className="rounded-md bg-[#253342] px-6 text-white hover:bg-[#1a2530]" asChild>
                                    <Link href="/login">Masuk</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs (Jika ada) */}
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 mt-4 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
