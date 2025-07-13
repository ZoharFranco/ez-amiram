'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';


interface ClientLayoutProps {
    children: ReactNode;
}


export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <>
            <title>לימודי אנגלית לאמירים - ezamiram</title>
            <Navigation />
            <main className='mt-10 mb-24'>
                {children}
            </main>
        </>
    );
}