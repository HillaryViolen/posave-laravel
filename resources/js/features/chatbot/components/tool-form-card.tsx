import { Button } from '@/components/ui/button';
import { submitToolForm } from '@/features/chatbot/api';
import { useState } from 'react';
import type { FormField, PendingForm } from '../types';

interface ToolFormCardProps {
    form: PendingForm;
    conversationId: number;
    onSubmitted: (assistantMessage: { content: string; action: any }) => void;
}

export function ToolFormCard({ form, conversationId, onSubmitted }: ToolFormCardProps) {
    const [values, setValues] = useState<Record<string, string | number>>(Object.fromEntries(form.fields.map((f) => [f.name, f.value])));
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValid = form.fields.every((f) => !f.required || String(values[f.name] ?? '').trim() !== '');

    const handleChange = (field: FormField, raw: string) => {
        setValues((prev) => ({ ...prev, [field.name]: field.type === 'number' ? Number(raw) : raw }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await submitToolForm(conversationId, form.tool_name, values);
            onSubmitted({ content: res.reply, action: res.action });
            setSubmitted(true);
        } catch {
            alert('Gagal mengirim form, coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return <p className="mt-2 text-xs font-medium text-slate-500">Form terkirim ✓</p>;
    }

    return (
        <div className="mt-2 w-full max-w-sm rounded-xl border border-blue-200 bg-blue-50 p-3">
            <div className="mb-3 flex flex-col gap-2.5">
                {form.fields.map((field) => (
                    <div key={field.name}>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                aria-label={field.label}
                                value={String(values[field.name] ?? '')}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
                            >
                                <option value="" disabled>
                                    Pilih {field.label.toLowerCase()}
                                </option>
                                {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                aria-label={field.label}
                                type={field.type === 'number' ? 'number' : 'text'}
                                value={values[field.name] ?? ''}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
                            />
                        )}
                    </div>
                ))}
            </div>

            <Button size="sm" onClick={handleSubmit} disabled={!isValid || loading} className="w-full bg-blue-600 text-xs hover:bg-blue-700">
                {loading ? 'Menyiapkan...' : 'Lanjutkan'}
            </Button>
        </div>
    );
}
