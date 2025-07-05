// components/shared/ProgressBar.tsx
import { useLanguage } from "@/frontend/contexts/LanguageContext"; // Still using this for translation

interface ProgressBarProps {
  percent: number;
  completed: number;
  total: number;
  inwork?: number;
  className?: string; // For custom styling on the overall container div
  progressBarClassName?: string; // For custom styling on the progress bar FILL (stroke color)
  trackClassName?: string; // For custom styling on the progress bar TRACK (stroke color)
  textColorClass?: string; // For custom styling on the percentage text
  size?: number; // Size of the circular progress bar (diameter)
  strokeWidth?: number; // Thickness of the progress bar stroke
}

export default function ProgressBar({
  percent,
  completed,
  total,
  className = '',
  progressBarClassName = '',
  trackClassName = '',
  textColorClass = 'text-gray-700',
  size = 160, // Default size: 80px for better visibility of inner text
  strokeWidth = 8, // Default stroke width: 8px for good visual weight
}: ProgressBarProps) {
  const { t } = useLanguage();

  // Ensure percent is between 0 and 100, and handle NaN
  const displayPercent = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Calculate the strokeDashoffset for progress
  const offset = circumference - (displayPercent / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90" // Start progress from the top
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Shadow/Glow Filter Definition (Optional) */}
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255,255,255,0.05)" /> {/* Subtle inner glow */}
          </filter>
        </defs>

        {/* Background Track Circle */}
        <circle
          className={`
            stroke-current text-gray-200 dark:text-gray-700
            ${trackClassName}
          `}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress Fill Circle */}
        <circle
          className={`
            stroke-current text-[rgb(var(--color-primary))]
            transition-[stroke-dashoffset] duration-700 ease-in-out
            ${progressBarClassName}
          `}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" // Makes the end of the progress line rounded
          style={{ filter: `url(#shadow)` }} // Apply the shadow filter here
        />
      </svg>

      {/* Text inside the circle */}
      <div className={`absolute flex flex-col items-center justify-center ${textColorClass}`}>
        {/* Use a key to force re-render and trigger CSS animation on text update */}
        <span
          key={displayPercent} // Key changes when percent changes, triggering animation
          className="font-extrabold text-xl animate-fade-in-scale leading-none"
          // If you want more control over color specifically for the percentage
          // Consider a separate `percentColorClass` prop or inline style if needed
        >
          {displayPercent}%
        </span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {t('common.completed_short')} {total} / {completed}
        </span>
      </div>
    </div>
  );
}