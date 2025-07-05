'use client';

import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {
    BoltIcon,
    ClockIcon,
    HandRaisedIcon,
    MoonIcon,
    SunIcon
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';

type TimeOption = {
    minutes: number;
    label: string;
    icon: typeof ClockIcon;
    iconClassName: string;
};

interface TimeSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTime: (minutes: number) => void;
}

export default function TimeSelectionDialog({ isOpen, onClose, onSelectTime }: TimeSelectionDialogProps) {
    const { t } = useLanguage();

    const timeOptions: TimeOption[] = [
        {
            minutes: 5,
            label: t('pages.quickLearn.timeOptions.5min'),
            icon: BoltIcon,
            iconClassName: 'text-yellow-500' // Lightning fast
        },
        {
            minutes: 15,
            label: t('pages.quickLearn.timeOptions.15min'),
            icon: HandRaisedIcon,
            iconClassName: 'text-green-500' // Quick session
        },
        {
            minutes: 30,
            label: t('pages.quickLearn.timeOptions.30min'),
            icon: SunIcon,
            iconClassName: 'text-orange-500' // Half hour
        },
        {
            minutes: 60,
            label: t('pages.quickLearn.timeOptions.1hour'),
            icon: MoonIcon,
            iconClassName: 'text-indigo-500' // Full hour
        },
    ];

    return (
        <Transition appear show={isOpen}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                <DialogTitle className="text-title text-gray-900 mb-4">
                                    {t('pages.quickLearn.selectTime')}
                                </DialogTitle>

                                <div className="grid grid-cols-2 gap-3">
                                    {timeOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.minutes}
                                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                                onClick={() => {
                                                    onSelectTime(option.minutes);
                                                    onClose();
                                                }}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 ${option.iconClassName}`} />
                                                <span className="text-label text-gray-900">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 