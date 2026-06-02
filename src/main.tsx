import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.tsx';
import { PAYPAL_CONFIG } from './config/paypal';

// Load PayPal SDK dynamically
const script = document.createElement('script');
script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.CLIENT_ID}&currency=${PAYPAL_CONFIG.CURRENCY}&intent=${PAYPAL_CONFIG.INTENT}`;
script.async = true;
script.setAttribute('data-namespace', 'paypal');
document.head.appendChild(script);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
