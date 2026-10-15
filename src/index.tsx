import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './index.css';
import './tailwind-theme.css';
import './typography.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UpdateProvider } from '@/hooks/use-update';
import { UpdateProgressBar } from '@/components/UpdateProgressBar';
import { CommandPalette } from '@/components/CommandPalette';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UpdateProvider>
        <TooltipProvider delayDuration={200}>
          <UpdateProgressBar />
          <CommandPalette />
          <App />
          <Toaster position="top-center" richColors closeButton />
        </TooltipProvider>
      </UpdateProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
