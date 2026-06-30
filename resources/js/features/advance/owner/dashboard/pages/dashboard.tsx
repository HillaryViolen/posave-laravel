import { Button } from '@/components/ui';
import { DashboardSidebarLayout } from '@/layouts';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [];

export default function Dashboard() {
    return (
        <DashboardSidebarLayout title="Dashboard" description="Kelola semua kebutuhan anda disini">
            <Head title="Dashboard" />
            <div className="flex min-h-screen flex-col gap-6 bg-slate-50/50 p-8">
                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 border-slate-200 bg-white px-4 text-slate-700">
                            OUTLET 1
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                            <Button variant="ghost" size="icon" className="h-full rounded-none border-r border-slate-100 px-2 hover:bg-slate-50">
                                <ChevronLeft className="h-4 w-4 text-slate-400" />
                            </Button>
                            <div className="flex items-center px-4 text-sm font-medium text-slate-700">
                                <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                                12 December 2026
                            </div>
                            <Button variant="ghost" size="icon" className="h-full rounded-none border-l border-slate-100 px-2 hover:bg-slate-50">
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-700">
                            Semua Kategori
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-700">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        <div className="h-40 rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
                        <div className="h-80 rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="h-60 rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
                        <div className="h-96 rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
