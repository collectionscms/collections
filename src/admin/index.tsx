/* eslint-disable import/no-import-module-exports */
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../lang/translations/config';
import Routes from './components/routes';
import { AuthProvider } from './components/utilities/Auth';
import { ColorModeProvider } from './components/utilities/ColorMode';
import { ConfigProvider } from './components/utilities/Config';
import { ThemeProvider } from './components/utilities/Theme';

const Index = () => (
  <>
    <ConfigProvider
      config={{
        serverUrl: 'http://localhost:4000',
      }}
    >
      <ColorModeProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Routes />
              </SnackbarProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </ColorModeProvider>
    </ConfigProvider>
  </>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Index />);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
