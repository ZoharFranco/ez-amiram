'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <>
            <Navigation />
            <main>
                {children}
            </main>
        </>
    );
} 