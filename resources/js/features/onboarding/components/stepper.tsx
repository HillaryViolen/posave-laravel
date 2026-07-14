interface StepperProps {
    step: 1 | 2;
}

export function Stepper({ step }: StepperProps) {
    return (
        <>
            <div className="mb-10 flex items-center">
                <div className="flex items-center gap-2">
                    <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium"
                        style={{ background: 'var(--primary-900)', color: '#fff' }}
                    >
                        {step > 1 ? (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            '1'
                        )}
                    </div>
                    <span
                        className="hidden text-sm font-medium sm:inline"
                        style={{ color: step === 1 ? 'var(--primary-900)' : 'var(--primary-600)' }}
                    >
                        Pilih mode
                    </span>
                </div>

                <div className="mx-3 h-px flex-1 transition-all duration-300" style={{ background: step > 1 ? 'var(--primary-900)' : '#e2e8f0' }} />

                <div className="flex items-center gap-2">
                    <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all"
                        style={{
                            background: step === 2 ? 'var(--primary-900)' : '#f1f5f9',
                            color: step === 2 ? '#fff' : 'var(--primary-600)',
                        }}
                    >
                        2
                    </div>
                    <span className="hidden text-sm font-medium sm:inline" style={{ color: step === 2 ? 'var(--primary-900)' : '#94a3b8' }}>
                        Informasi bisnis
                    </span>
                </div>
            </div>

            <p className="-mt-8 mb-6 text-center text-xs font-medium sm:hidden" style={{ color: 'var(--primary-600)' }}>
                Langkah {step} dari 2: {step === 1 ? 'Pilih mode' : 'Informasi bisnis'}
            </p>
        </>
    );
}
