import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FireIcon } from '@heroicons/react/24/outline';

interface CurrentGradeCardProps {
  predictedGrade: number;
  learningStreak: number;
  animateProgress: boolean;
}

const size = 320;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function CurrentGradeCard({ predictedGrade, learningStreak, animateProgress }: CurrentGradeCardProps) {
  const { t } = useLanguage();
  const progressOffset = circumference - (predictedGrade / 100) * circumference;
  return (
    <div className="card p-12 gradient-animate">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-title text-white">
            {t('pages.home.currentGrade')}
          </h2>
          <div className="badge badge-accent">
            <span>{learningStreak} {t('pages.home.learningStreak')}</span>
            <FireIcon className="w-5 h-5 inline-block mr-2" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="circular-progress mb-8">
            <div className="relative">
              <svg width={size} height={size}>
                <circle
                  className="progress-background"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                />
                <circle
                  className="progress-circle"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: animateProgress ? progressOffset : circumference,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-7xl font-bold text-white block">
                    {predictedGrade}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-subtitle text-white/90 text-center">
            {t('pages.home.outOf')} 100
          </p>
        </div>
      </div>
    </div>
  );
} 