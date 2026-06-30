import { AppLogoIcon } from '@/components';
import { Link } from '@inertiajs/react';

export interface FeatureItemData {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    title: React.ReactNode;
    description: string;
    illustrationImage: string;
    features: FeatureItemData[];
}

export function AuthSplitLayout({ children, title, description, illustrationImage, features }: AuthSplitLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex w-full flex-col justify-between px-8 py-8 md:w-1/2 lg:px-24">
                <div>
                    <Link href="/" className="flex items-center gap-2 font-bold text-[#003399]">
                        <AppLogoIcon className="h-6 w-6 fill-current" />
                        <span className="text-xl">POSAVE</span>
                    </Link>
                </div>

                <div className="mx-auto my-auto w-full max-w-sm py-12">
                    <div className="mb-8">
                        <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">{title}</h1>
                        <p className="mt-2 text-sm text-slate-500">{description}</p>
                    </div>
                    {children}
                </div>

                <div className="text-center text-xs text-slate-400 md:text-left">© 2026 POSAVE. Semua hak dilindungi.</div>
            </div>

            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] p-12 md:flex">
                <div className="relative z-10 w-full max-w-md">
                    <img src={illustrationImage} alt="Illustration" className="h-auto w-full drop-shadow-xl" />

                    <div className="mt-12 flex flex-col gap-6">
                        {features.map((feature, index) => (
                            <FeatureItem key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, description }: FeatureItemData) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">{icon}</div>
            <div>
                <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
            </div>
        </div>
    );
}
