'use client';

import AuthDialog from '@/frontend/components/AuthDialog';
import { LanguageProvider } from '@/frontend/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/frontend/contexts/auth-context';
import { Rubik } from 'next/font/google';
import { useEffect, useState } from 'react';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [user, loading]);

  return (
    <>
      {children}
      <AuthDialog isOpen={showDialog} onClose={() => { }} forceMode />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html>
      <body className={rubik.className}>
        <AuthProvider>
          <LanguageProvider>
            <AuthGate>
              {children}
            </AuthGate>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
