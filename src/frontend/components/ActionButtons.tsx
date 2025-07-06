import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { TestTube2 } from 'lucide-react';

interface ActionButtonsProps {
  onQuickLearn: () => void;
  onSimulation: () => void;
  t: (key: string) => string;
}

export default function ActionButtons({ onQuickLearn, onSimulation, t }: ActionButtonsProps) {
  return (
    <div className="grid-auto-fit gap-8 mt-6 mb-8">
      <button
        onClick={onQuickLearn}
        className="card card-hover p-10 group bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white items-center justify-center text-start"
      >
        <p className="text-subtitle text-white/90 group-hover:text-white transition-colors text-start flex items-center gap-2 justify-between">
          {t('pages.home.quickLearnDescription')}
          <RocketLaunchIcon className="w-10 h-10" />
        </p>
      </button>
      <button
        onClick={onSimulation}
        className="card card-hover p-10 group bg-gradient-to-br from-[rgb(var(--color-secondary))] to-[rgb(var(--color-accent))] text-white items-center justify-center text-start"
      >
        <p className="text-subtitle text-white/90 group-hover:text-white transition-colors text-start flex items-center gap-2 justify-between">
          {t('pages.home.fullSimulationDescription')}
          <TestTube2 className="w-10 h-10" />
        </p>
      </button>
    </div>
  );
} 