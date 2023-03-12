/* eslint-disable import/no-import-module-exports */
import { SnackbarProvider } from 'notistack';
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../lang/translations/config';
import Loader from './components/elements/Loader';
import Routes from './components/routes';
import { AuthProvider } from './components/utilities/Auth';
import { ColorModeProvider } from './components/utilities/ColorMode';
import { ConfigProvider } from './components/utilities/Config';
import SWRConfigure from './components/utilities/SWRConfigure';
import { ThemeProvider } from './components/utilities/Theme';

const Loading = Loader(lazy(() => import('./components/elements/Loading')));

const Index = () => (
  <>
    <Suspense fallback={<Loading />}>
      <ColorModeProvider>
        <ThemeProvider>
          <Router>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <SWRConfigure>
                <AuthProvider>
                  <ConfigProvider
                    config={{
                      serverUrl: 'http://localhost:4000',
                    }}
                  >
                    <Routes />
                  </ConfigProvider>
                </AuthProvider>
              </SWRConfigure>
            </SnackbarProvider>
          </Router>
        </ThemeProvider>
      </ColorModeProvider>
    </Suspense>
  </>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Index />);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
