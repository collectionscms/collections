import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import 'simplebar-react/dist/simplebar.min.css';
import '../lang/translations/config.js';
import { Routes } from './components/Routes/index.js';
import { Loader } from './components/elements/Loader/index.js';
import { AuthProvider } from './components/utilities/Auth/index.js';
import { ColorModeProvider } from './components/utilities/ColorMode/index.js';
import { ConfigProvider } from './components/utilities/Config/index.js';
import { SWRConfigure } from './components/utilities/SWRConfigure/index.js';
import { Snackbar } from './components/utilities/Snackbar/index.js';
import { ThemeCustomization } from './components/utilities/Theme/index.js';
import lazy from './utilities/lazy.js';

const Loading = Loader(lazy(() => import('./components/elements/Loading/index.js'), 'Loading'));

const Index = () => (
  <Suspense fallback={<Loading />}>
    <ColorModeProvider>
      <ThemeCustomization>
        <Snackbar>
          <SWRConfigure>
            <AuthProvider>
              <ConfigProvider>
                <Routes />
              </ConfigProvider>
            </AuthProvider>
          </SWRConfigure>
        </Snackbar>
      </ThemeCustomization>
    </ColorModeProvider>
  </Suspense>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<Index />);
