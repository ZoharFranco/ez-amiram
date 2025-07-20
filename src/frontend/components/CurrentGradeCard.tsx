import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FireIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import ActionButton from './shared/ActionButton';

interface CurrentGradeCardProps {
  predictedGrade: number;
  learningStreak: number;
  animateProgress: boolean;
}

// Responsive sizes
const sizeMobile = 220;
const sizeDesktop = 320;
const strokeWidthMobile = 12;
const strokeWidthDesktop = 16;

export default function CurrentGradeCard({ predictedGrade, learningStreak, animateProgress }: CurrentGradeCardProps) {
  const { t } = useLanguage();
  const router = useRouter();

  // Use window width to determine size (SSR safe fallback)
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const size = isMobile ? sizeMobile : sizeDesktop;
  const strokeWidth = isMobile ? strokeWidthMobile : strokeWidthDesktop;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapFraction = 0.2;
  const gapLength = circumference * gapFraction;
  const visibleLength = circumference - gapLength;
  const gapOffset = circumference * 0.375;
  const backgroundArcColor = "#f3f4f6"; // Tailwind gray-100
  const progressArc = visibleLength * (predictedGrade / 100);
  const progressOffset = visibleLength - progressArc + gapOffset;

  return (
    <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 shadow-sm p-8 sm:p-12 flex flex-col items-center space-y-8 sm:space-y-10 min-h-[400px] sm:min-h-[520px]">
      {/* Streak badge at top left, adjust for mobile */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center space-x-1 sm:space-x-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 text-orange-500 text-xs sm:text-sm font-semibold z-10">
        <FireIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{learningStreak} {t('pages.home.learningStreak')}</span>
      </div>
      <div className="flex flex-col items-center w-full mb-8">
        <div className="relative mb-1 sm:mb-2">
          <svg width={size} height={size}>
            {/* Background arc */}
            <circle
              stroke={backgroundArcColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            {/* Progress arc */}
            <circle
              className="stroke-emerald-500"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={`${visibleLength} ${gapLength}`}
              strokeDashoffset={animateProgress ? progressOffset : visibleLength + gapOffset}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </svg>
          {/* Grade number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl sm:text-8xl font-extrabold text-emerald-600">{predictedGrade}</span>
          </div>
        </div>
        <span className="text-gray-500 text-3xl sm:text-4xl font-medium mt-5">{t('pages.home.currentGrade')}</span>
      </div>
      {/* Go to Simulations button */}
        <ActionButton
          onClick={() => router.push('/frontend/simulations')}
        >
          {t('pages.home.goToSimulations')}
        </ActionButton>

    </div>
  );
}