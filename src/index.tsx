import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './index.css';
import './tailwind-theme.css';
import './typography.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TooltipProvider delayDuration={200}>
        <App />
        <Toaster position="top-center" richColors closeButton />
      </TooltipProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
