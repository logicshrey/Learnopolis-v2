import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider } from '../context/ThemeContext';
import Feedback from '@/components/Feedback';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps }
}: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse" />
      )}
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