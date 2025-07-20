'use client';

import { useLanguage } from '@/frontend/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

import { HomeIcon } from '@heroicons/react/24/outline';
import { BookAIcon } from 'lucide-react';
import Image from "next/image";
import { PiGameControllerLight, PiGraduationCapDuotone, PiLightbulbLight } from 'react-icons/pi';
import LanguageSwitcher from './LanguageSwitcher';

type NavItem = {
    href: string;
    label: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>> | IconType;
};

export default function Navigation() {
    const pathname = usePathname();
    const { t, dir } = useLanguage();

    const isActive = (path: string) => pathname === path;

    const navItems: NavItem[] = [
        { href: '/frontend/simulations', label: t('nav.simulations'), icon: PiGameControllerLight },
        { href: '/frontend/questions', label: t('nav.questions'), icon: PiGraduationCapDuotone },
        { href: '/', label: t('nav.home'), icon: HomeIcon },
        { href: '/frontend/vocabulary', label: t('nav.vocabulary'), icon: BookAIcon },
        { href: '/frontend/tips', label: t('nav.tips'), icon: PiLightbulbLight }
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex space-x-8">
                            {navItems.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center space-x-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive(href)
                                        ? 'text-[rgb(var(--color-primary))] border-b-2 border-[rgb(var(--color-primary))]'
                                        : 'text-[rgb(var(--color-text-light))] hover:text-[rgb(var(--color-text))] hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}


            <nav className="md:hidden fixed top-0 left-0 right-0 bg-emerald-300/60 backdrop-blur-md border-b-2 border-emerald-400 shadow-emerald-100 shadow-sm z-10">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex space-x-8">
                            <Image
                                src="/favicon.ico"
                                alt={t('professor.altText')}
                                className="object-cover rounded-2xl"
                                priority
                                width={64}
                                height={64}
                            />
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-10" dir={dir}>
                <div className="max-w-lg mx-auto px-4">
                    <div className="flex justify-around py-2">
                        {navItems.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center p-2 transition-all duration-200 ${isActive(href)
                                    ? 'text-[rgb(var(--color-primary))] transform -translate-y-1'
                                    : 'text-[rgb(var(--color-text-light))] hover:text-[rgb(var(--color-primary))]'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 ${isActive(href) ? 'stroke-2' : 'stroke-1'}`} />
                                <span className="text-xs mt-1 font-medium">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Content Padding */}
            <div className="md:pt-16 pb-16 md:pb-0" />
        </>
    );
} 