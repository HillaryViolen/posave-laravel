import { Head, Link, useForm } from '@inertiajs/react';
import { Clock, Eye, LoaderCircle, Lock, Mail, Phone, PieChart, User, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { Button, Checkbox, Input, InputError, Label } from '@/components';
import { AuthSplitLayout } from '@/layouts';

interface RegisterForm {
    [key: string]: string | boolean;
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const registerFeatures = [
        {
            icon: <UserPlus className="h-5 w-5 text-[#003399]" />,
            title: 'Akun gratis selamanya',
            description: 'Daftar gratis dan nikmati semua fitur POSAVE.',
        },
        {
            icon: <Clock className="h-5 w-5 text-[#003399]" />,
            title: 'Hemat waktu dan tenaga',
            description: 'Otomatiskan pencatatan dan kelola bisnis dengan lebih efisien.',
        },
        {
            icon: <PieChart className="h-5 w-5 text-[#003399]" />,
            title: 'Keputusan lebih cerdas',
            description: 'Dapatkan laporan dan insight untuk kembangkan bisnis Anda.',
        },
    ];

    return (
        <AuthSplitLayout
            title="Buat akun baru"
            description="Daftar untuk mulai menggunakan POSAVE"
            illustrationImage="/images/register-illustration.png"
            features={registerFeatures}
        >
            <Head title="Register" />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-1.5">
                    <Label htmlFor="name" className="font-bold text-slate-700">
                        Nama lengkap
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="font-bold text-slate-700">
                        Email
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Masukkan email Anda"
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="phone" className="font-bold text-slate-700">
                        Nomor telepon
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Phone className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Masukkan nomor telepon"
                            className="h-12 pl-10"
                        />
                    </div>
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password" className="font-bold text-slate-700">
                        Password
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Buat password"
                            className="h-12 pr-10 pl-10"
                        />
                        <button
                            aria-label="button"
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password_confirmation" className="font-bold text-slate-700">
                        Konfirmasi password
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password"
                            className="h-12 pr-10 pl-10"
                        />
                        <button
                            aria-label="button"
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="mt-2 flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        name="terms"
                        checked={data.terms}
                        onChange={(e) => setData('terms', (e.target as HTMLInputElement).checked)}
                        className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-slate-600">
                        Saya setuju dengan{' '}
                        <Link href="#" className="font-semibold text-[#003399] hover:underline">
                            Syarat & Ketentuan
                        </Link>{' '}
                        dan{' '}
                        <Link href="#" className="font-semibold text-[#003399] hover:underline">
                            Kebijakan Privasi
                        </Link>
                    </Label>
                </div>

                <Button type="submit" className="text-md mt-2 h-12 w-full bg-[#003399] hover:bg-[#002266]" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Daftar
                </Button>

                <div className="mt-4 text-center text-sm text-slate-500">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="font-semibold text-[#003399] hover:underline">
                        Masuk sekarang
                    </Link>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
