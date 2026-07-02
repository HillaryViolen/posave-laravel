import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

interface Props {
    email: string;
    status?: string;
}

export default function VerifyOtp({ email, status }: Props) {
    const [codes, setCodes] = useState(['', '', '', '', '', '']);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const { post: resendPost, processing: resendProcessing } = useForm({});

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; // hanya angka

        const newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);
        setData('code', newCodes.join(''));

        // Auto fokus ke kotak berikutnya
        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !codes[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCodes = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
        setCodes(newCodes);
        setData('code', newCodes.join(''));
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify'));
    };

    const handleResend = () => {
        resendPost(route('otp.resend'));
    };

    return (
        <>
            <Head title="Verifikasi OTP" />

            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Email</h1>
                        <p className="mt-2 text-sm text-slate-500">Kami telah mengirim kode 6 digit ke</p>
                        <p className="font-medium text-slate-700">{email}</p>
                    </div>

                    {status && <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">{status}</div>}

                    {errors.code && <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{errors.code}</div>}

                    <form onSubmit={submit}>
                        {/* 6 kotak input OTP */}
                        <div className="mb-6 flex justify-center gap-3">
                            {codes.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        inputs.current[i] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    aria-label={`Digit ke-${i + 1}`}
                                    className="h-12 w-12 rounded-lg border border-slate-300 text-center text-xl font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.code.length < 6}
                            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Memverifikasi...' : 'Verifikasi'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-sm text-slate-500">Tidak menerima kode? </span>
                        <button
                            onClick={handleResend}
                            disabled={resendProcessing}
                            className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
                        >
                            Kirim ulang
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
