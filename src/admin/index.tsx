/* eslint-disable import/no-import-module-exports */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './components/routes';
import { ThemeContextProvider } from './components/utilities/Theme';

const Index = () => (
  <ThemeContextProvider>
    <Router>
      <Routes />
    </Router>
  </ThemeContextProvider>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Index />);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
