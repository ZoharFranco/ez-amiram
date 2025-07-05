'use client';

import { Button, Dialog, Transition } from '@headlessui/react';
import { motion } from "framer-motion";
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/auth-context';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  forceMode?: boolean;
}

export default function AuthDialog({ isOpen, onClose, forceMode }: AuthDialogProps) {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
        await signIn();
      if (!forceMode) onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={forceMode ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Strong blur and green overlay */}
          <div className="fixed inset-0 bg-gradient-to-br from-[rgba(16,185,129,0.35)] via-[rgba(52,211,153,0.25)] to-[rgba(6,182,212,0.25)] backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Glassmorphism, green gradient border, soft green bg */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl shadow-2xl transition-all relative bg-white/70 backdrop-blur-xl border-2 border-transparent bg-clip-padding"
                style={{
                  borderImage: 'linear-gradient(135deg, #10b981 10%, #34d399 90%) 1',
                  boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.18)',
                }}
              >
                <div className="flex flex-col items-center mb-6 pt-6 pb-2 px-2 bg-gradient-to-br from-[rgba(16,185,129,0.10)] via-[rgba(52,211,153,0.10)] to-[rgba(255,255,255,0.10)] rounded-2xl">
                  <div className="bg-[rgb(var(--color-primary))] rounded-full p-5 mb-4 shadow-lg border-4 border-white/60">
                    <Image src="/icons/favicon.ico" alt="EZ Amiram" width={100} height={100} />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`flex flex-col items-center space-y-6`}
                >
                  <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--color-text))]">{t('landing.hero.title')}</h1>
                  <div className="relative group flex items-center justify-center">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button
                      onClick={handleSignIn}
                      className={`relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-2`}
                    >
                      <div className="flex items-center">
                      {loading ? t('auth.loading') : t('auth.continueWithGoogle')}    
                      <FaGoogle className={`mr-3 h-4 w-4`} />
                      </div>
                    </Button>
                  </div>
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    {t('landing.hero.subtext')}
                  </p>
                </motion.div>
                <div className="pb-6" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 