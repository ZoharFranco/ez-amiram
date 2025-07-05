'use client';

import ar from '@/frontend/translations/ar.json';
import en from '@/frontend/translations/en.json';
import he from '@/frontend/translations/he.json';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'he' | 'ar';

type TranslationValue = string | { [key: string]: TranslationValue };

interface Translations {
    [key: string]: TranslationValue;
}

type LanguageContextType = {
    t: (key: string) => string;
    setLanguage: (lang: Language) => void;
    currentLanguage: Language;
    dir: 'rtl' | 'ltr';
};

const translations: { [key in Language]: Translations } = {
    en,
    he,
    ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('he');

    useEffect(() => {
        // Set initial language based on browser preference or stored preference
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang && ['en', 'he', 'ar'].includes(storedLang)) {
            setLanguage(storedLang);
        } else {
            const browserLang = navigator.language.split('-')[0] as Language;
            setLanguage(['en', 'he', 'ar'].includes(browserLang) ? browserLang : 'en');
        }
    }, []);

    useEffect(() => {
        // Update HTML dir attribute for RTL languages
        document.documentElement.dir = language === 'he' || language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: TranslationValue = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return the key if translation is not found
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ t, setLanguage, currentLanguage: language, dir: language === 'he' || language === 'ar' ? 'rtl' : 'ltr' }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 