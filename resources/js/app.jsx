import './bootstrap';
import { createRoot } from 'react-dom/client';
//import { createInertiaApp } from '@inertiajs/react';
//import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';

import '../css/app.css';


const theme = createTheme({
     direction: 'rtl',
});

const components = {
     HomePage,
     Login,
     Register,
     Dashboard
};

const pageName = window.pageName || 'HomePage';
const pageProps = window.pageProps || {};

const Component = components[pageName];
if (!Component) {
     console.error(`Component "${pageName}" not found. Available: ${Object.keys(components).join(', ')}`);
     throw new Error(`Page component "${pageName}" not found.`);
}

const auth = window.auth || { user: null };

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
     <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
     </ThemeProvider>
)