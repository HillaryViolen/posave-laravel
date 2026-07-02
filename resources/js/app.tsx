import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './features/settings/hooks/use-appearance';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Posave';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const parts = name.split('/');
        const pageName = parts.pop();
        const folderPath = parts.join('/');

        const path = folderPath ? `./features/${folderPath}/pages/${pageName}.tsx` : `./features/${pageName}/pages/${pageName}.tsx`;

        return resolvePageComponent(path, import.meta.glob('./features/**/pages/**/*.tsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
