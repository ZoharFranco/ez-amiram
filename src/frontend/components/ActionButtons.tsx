import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { TestTube2 } from 'lucide-react';

interface ActionButtonsProps {
  onQuickLearn: () => void;
  onSimulation: () => void;
  t: (key: string) => string;
}

export default function ActionButtons({ onQuickLearn, onSimulation, t }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
      <button
        onClick={onQuickLearn}
        className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-200/70 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-400 hover:scale-[1.03] hover:-rotate-1 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-indigo-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-400" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-400">
                <RocketLaunchIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-400">
                {t('pages.home.quickLearn')}
              </h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-pulse group-hover:bg-blue-500 transition-colors duration-300" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:animate-pulse delay-100 group-hover:bg-indigo-500 transition-colors duration-300" />
              </div>
            </div>
            <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
              {t('pages.home.quickLearnDescription')}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-400" />
      </button>

      <button
        onClick={onSimulation}
        className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-200/70 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-400 hover:scale-[1.03] hover:rotate-1 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-400" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-all duration-400">
                <TestTube2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all duration-400">
                {t('pages.home.fullSimulation')}
              </h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:animate-pulse group-hover:bg-emerald-500 transition-colors duration-300" />
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full group-hover:animate-pulse delay-100 group-hover:bg-teal-500 transition-colors duration-300" />
              </div>
            </div>
            <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
              {t('pages.home.fullSimulationDescription')}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-400" />
      </button>
    </div>
  );
}