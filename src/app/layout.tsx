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
    // Stronger: Only show dialog if user is definitely not authenticated and not loading
    setShowDialog(!loading && !user);
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
    <html lang="he">
      <head>
        <title>
          לימודי אנגלית למבחן פסיכומטרי\אמירם
        </title>
        <meta name="description" content="התחזק באנגלית לפסיכומטרי או אמירם עם תרגול חכם, מעקב התקדמות, וממשק עוצמתי." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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
