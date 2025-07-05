'use client';

import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
] as const;

export default function LanguageSwitcher() {
    const { currentLanguage, setLanguage } = useLanguage();

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <GlobeAltIcon className="w-5 h-5 text-gray-600 md:block" />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute bottom-full right-0 mb-2 w-48 origin-bottom-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:bottom-auto md:top-full md:mt-2 md:origin-top-right">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <MenuItem key={lang.code}>
                                {({ active }) => (
                                    <button
                                        onClick={() => setLanguage(lang.code)}
                                        className={`
                                            ${active ? 'bg-gray-100' : ''}
                                            ${currentLanguage === lang.code ? 'font-semibold text-indigo-600' : 'text-gray-700'}
                                            group flex w-full items-center px-2 py-2 text-sm
                                        `}
                                    >
                                        <span className="mr-2">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                )}
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
} 