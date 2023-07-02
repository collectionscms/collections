import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../lang/translations/config.js';
import { Routes } from './components/Routes/index.js';
import { Loader } from './components/elements/Loader/index.js';
import { AuthProvider } from './components/utilities/Auth/index.js';
import { ColorModeProvider } from './components/utilities/ColorMode/index.js';
import { ConfigProvider } from './components/utilities/Config/index.js';
import { Notistack } from './components/utilities/Notistack/index.js';
import { SWRConfigure } from './components/utilities/SWRConfigure/index.js';
import { ThemeProvider } from './components/utilities/Theme/index.js';
import lazy from './utilities/lazy.js';

const Loading = Loader(lazy(() => import('./components/elements/Loading/index.js'), 'Loading'));

const Index = () => (
  <Suspense fallback={<Loading />}>
    <ColorModeProvider>
      <ThemeProvider>
        <Router>
          <Notistack>
            <SWRConfigure>
              <AuthProvider>
                <ConfigProvider>
                  <Routes />
                </ConfigProvider>
              </AuthProvider>
            </SWRConfigure>
          </Notistack>
        </Router>
      </ThemeProvider>
    </ColorModeProvider>
  </Suspense>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<Index />);
