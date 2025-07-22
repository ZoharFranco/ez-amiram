'use client';

import ar from '@/frontend/translations/ar.json';
import en from '@/frontend/translations/en.json';
import he from '@/frontend/translations/he.json';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'he' | 'en' | 'ar';

type TranslationValue = string | { [key: string]: TranslationValue };

interface Translations {
    [key: string]: TranslationValue;
}

type LanguageContextType = {
    t: (key: string, variables?: { [key: string]: string | number }) => string;
    setLanguage: (lang: Language) => void;
    currentLanguage: Language;
    dir: 'rtl' | 'ltr';
};

const translations: { [key in Language]: Translations } = {
    he,
    en,
    ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('he');

    useEffect(() => {
        // Set initial language based on browser preference or stored preference
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang && ['he', 'en', 'ar'].includes(storedLang)) {
            setLanguage(storedLang);
        } else {
            setLanguage('he');
        }
    }, []);

    useEffect(() => {
        // Update HTML dir attribute for RTL languages
        document.documentElement.dir = language === 'he' || language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key: string, variables?: { [key: string]: string | number }): string => {
        const keys = key.split('.');
        let value: TranslationValue = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return the key if translation is not found
            }
        }

        if (typeof value === 'string') {
            if (variables) {
                return Object.entries(variables).reduce((acc, [k, v]) => {
                    return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
                }, value);
            }
            return value;
        }

        return key;
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