import { AppLayout } from '@/layouts';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Welcome" />
            hello world
        </AppLayout>
    );
}
