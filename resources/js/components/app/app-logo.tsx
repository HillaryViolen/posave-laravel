import { AppLogoIcon } from '@/components';

export function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <AppLogoIcon className="size-5 fill-current text-[var(--primary-900)]" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm text-[var(--white)]">
                <span className="mb-0.5 truncate leading-none font-semibold">POSAVE</span>
            </div>
        </>
    );
}
