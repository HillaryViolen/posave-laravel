import { Head, Link, useForm } from '@inertiajs/react';
import { BarChart3, Cloud, LoaderCircle, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button, Checkbox, Input, InputError, Label } from '@/components';
import { AuthSplitLayout } from '@/layouts';
import { SocialLoginButton } from '../components';

interface LoginForm {
    [key: string]: string | boolean;
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const loginFeatures = [
        {
            icon: <BarChart3 className="h-5 w-5 text-[#003399]" />,
            title: 'Kelola bisnis lebih mudah',
            description: 'Semua data penjualan dan laporan bisnis Anda dalam satu tempat.',
        },
        {
            icon: <ShieldCheck className="h-5 w-5 text-[#003399]" />,
            title: 'Aman dan terpercaya',
            description: 'Keamanan data Anda adalah prioritas kami.',
        },
        {
            icon: <Cloud className="h-5 w-5 text-[#003399]" />,
            title: 'Akses kapan saja, di mana saja',
            description: 'Pantau dan kelola bisnis Anda dari perangkat manapun.',
        },
    ];

    return (
        <AuthSplitLayout
            title={
                <>
                    Selamat datang <span>👋</span>
                </>
            }
            description="Masuk untuk melanjutkan ke akun Anda"
            illustrationImage="/images/login-illustration.png"
            features={loginFeatures}
        >
            <Head title="Log in" />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold text-slate-700">
                        Email atau nomor telepon
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Masukkan email atau nomor telepon"
                        className="h-12"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="mt-2 grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="font-bold text-slate-700">
                            Password
                        </Label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-sm font-semibold text-[#003399] hover:underline">
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Masukkan password"
                        className="h-12"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="mt-1 flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" />
                    <Label htmlFor="remember" className="font-normal text-slate-600">
                        Ingat saya
                    </Label>
                </div>

                <Button type="submit" className="text-md mt-2 h-12 w-full bg-[#003399] hover:bg-[#002266]" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk
                </Button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">atau masuk dengan</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SocialLoginButton provider="google" icon={<img src="/icons/google.svg" alt="Google" className="h-5 w-5" />}>
                        Google
                    </SocialLoginButton>
                    <SocialLoginButton provider="facebook" icon={<img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5" />}>
                        Facebook
                    </SocialLoginButton>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="font-semibold text-[#003399] hover:underline">
                        Daftar sekarang
                    </Link>
                </div>
            </form>

            {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthSplitLayout>
    );
}
