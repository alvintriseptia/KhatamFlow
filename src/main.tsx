import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { logCompatibilityInfo } from './core/compatibility/browserCheck';

// Log browser compatibility information
if (import.meta.env.DEV) {
  logCompatibilityInfo();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
