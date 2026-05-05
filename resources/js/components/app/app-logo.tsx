import { AppLogoIcon } from '@/components';

export function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="text-primary size-5 fill-current dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-black">
                <span className="mb-0.5 truncate leading-none font-semibold">POSAVE</span>
            </div>
        </>
    );
}
