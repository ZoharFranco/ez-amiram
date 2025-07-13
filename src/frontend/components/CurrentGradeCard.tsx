import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FireIcon } from '@heroicons/react/24/outline';

interface CurrentGradeCardProps {
  predictedGrade: number;
  learningStreak: number;
  animateProgress: boolean;
}

const size = 200;
const strokeWidth = 16;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function CurrentGradeCard({ predictedGrade, learningStreak, animateProgress }: CurrentGradeCardProps) {
  const { t } = useLanguage();
  const progressOffset = circumference - (predictedGrade / 100) * circumference;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/95 via-white/90 to-emerald-50/95 backdrop-blur-sm border-2 border-emerald-200/80 hover:border-emerald-400/90 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 hover:scale-[1.03] p-8">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold font-rubik ">
            {t('pages.home.currentGrade')}
          </h2>
          <div className="relative">
            {/* Streak badge with orange text and border only */}
            <div className="relative px-3 py-3 rounded-2xl flex items-center space-x-3 group-hover:scale-110 transition-transform duration-500 shadow-lg border-2 border-orange-400">
              <FireIcon className="w-6 h-6 text-orange-400 group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
              <span className="text-orange-400 font-bold text-lg">
                {learningStreak} {t('pages.home.learningStreak')}
              </span>
          </div>
        </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-8">
            {/* Enhanced glow effect */}
            <div className="relative">
              <svg width={size} height={size} className="group-hover:rotate-2 transition-transform duration-700">
                {/* Background circle */}

                {/* Progress circle */}
                <circle
                  className="stroke-emerald-500 group-hover:stroke-emerald-400 transition-colors duration-700"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: animateProgress ? progressOffset : circumference,
                    // Removed drop-shadow from filter to remove the shadow from the background
                    filter: '',
                    transition: 'stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.7s ease, filter 0.7s ease',
                  }}
                />
                {/* Animated shimmer effect */}
                <circle
                  className="stroke-emerald-300 opacity-0 group-hover:opacity-30"
                  strokeWidth={2}
                  fill="transparent"
                  r={radius + 8}
                  cx={size / 2}
                  cy={size / 2}
                  style={{
                    strokeDasharray: '10 20',
                    animation: 'spin 3s linear infinite',
                    transition: 'opacity 0.7s ease',
                  }}
                />
              </svg>

              {/* Grade number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-7xl font-black bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent group-hover:scale-110 group-hover:from-emerald-600 group-hover:via-emerald-500 group-hover:to-emerald-400 transition-all duration-700 block drop-shadow-sm">
                    {predictedGrade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}