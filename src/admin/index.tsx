/* eslint-disable import/no-import-module-exports */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { systemStatus } from 'superfast-core';

const Index = () => <>server status: {systemStatus()}</>;

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Index />);

// Needed for Hot Module Replacement
if (typeof module.hot !== 'undefined') {
  module.hot.accept();
}
