import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider } from '../context/ThemeContext';
import Feedback from '@/components/Feedback';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <ToastProvider>
          <Head>
            <title>Learnopolis - AI-Powered Learning Platform</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <Component {...pageProps} />
          <Feedback />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 