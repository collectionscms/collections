/* eslint-disable import/no-import-module-exports */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './components/routes';
import '../lang/translations/config';
import { AuthProvider } from './components/utilities/Auth';
import { ConfigProvider } from './components/utilities/Config';
import { ThemeContextProvider } from './components/utilities/Theme';

const Index = () => (
  <ConfigProvider
    config={{
      collections: [
        { collection: 'Restaurant', singleton: false },
        { collection: 'Menu', singleton: false },
        { collection: 'Owner', singleton: true },
      ],
    }}
  >
    <ThemeContextProvider>
      <Router>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </Router>
    </ThemeContextProvider>
  </ConfigProvider>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Index />);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
