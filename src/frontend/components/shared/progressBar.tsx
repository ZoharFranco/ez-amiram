// components/shared/ProgressBar.tsx
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  percent: number;
  completed: number;
  total: number;
  inwork?: number;
  className?: string;
  progressBarClassName?: string;
  trackClassName?: string;
  textColorClass?: string;
  size?: number; // Optional override
  strokeWidth?: number; // Optional override
}

function getResponsiveSize() {
  if (typeof window === "undefined") {
    // SSR fallback: assume desktop
    return { size: 220, strokeWidth: 14 };
  }
  if (window.innerWidth < 640) {
    // Mobile
    return { size: 140, strokeWidth: 10 };
  }
  if (window.innerWidth < 1024) {
    // Tablet
    return { size: 160, strokeWidth: 12 };
  }
  // Desktop
  return { size: 180, strokeWidth: 16 };
}

export default function ProgressBar({
  percent,
  completed,
  total,
  className = "",
  progressBarClassName = "",
  trackClassName = "",
  textColorClass = "text-gray-700",
  size,
  strokeWidth,
}: ProgressBarProps) {
  const { t } = useLanguage();

  // Responsive sizing state
  const [dimensions, setDimensions] = useState(() => getResponsiveSize());

  useEffect(() => {
    function handleResize() {
      setDimensions(getResponsiveSize());
    }
    window.addEventListener("resize", handleResize);
    // Set on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use prop override if provided, else responsive
  const finalSize = size ?? dimensions.size;
  const finalStrokeWidth = strokeWidth ?? dimensions.strokeWidth;

  // Ensure percent is between 0 and 100, and handle NaN
  const displayPercent = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));

  const radius = (finalSize - finalStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayPercent / 100) * circumference;

  // Responsive text sizes
  let percentTextClass =
    "font-extrabold animate-fade-in-scale leading-none";
  let completedTextClass =
    "font-semibold text-gray-500 dark:text-gray-400";
  if (finalSize >= 240) {
    percentTextClass += " text-5xl";
    completedTextClass += " text-lg";
  } else if (finalSize >= 200) {
    percentTextClass += " text-4xl";
    completedTextClass += " text-base";
  } else if (finalSize >= 160) {
    percentTextClass += " text-3xl";
    completedTextClass += " text-sm";
  } else {
    percentTextClass += " text-xl";
    completedTextClass += " text-xs";
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: finalSize, height: finalSize, minWidth: finalSize, minHeight: finalSize }}
    >
      <svg
        className="transform -rotate-90"
        width={finalSize}
        height={finalSize}
        viewBox={`0 0 ${finalSize} ${finalSize}`}
      >
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255,255,255,0.05)" />
          </filter>
        </defs>
        {/* Background Track Circle */}
        <circle
          className={`
            stroke-current text-gray-200 dark:text-gray-700
            ${trackClassName}
          `}
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          r={radius}
          cx={finalSize / 2}
          cy={finalSize / 2}
        />
        {/* Progress Fill Circle */}
        <circle
          className={`
            stroke-current text-[rgb(var(--color-primary))]
            transition-[stroke-dashoffset] duration-700 ease-in-out
            ${progressBarClassName}
          `}
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          r={radius}
          cx={finalSize / 2}
          cy={finalSize / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `url(#shadow)` }}
        />
      </svg>
      {/* Text inside the circle */}
      <div className={`absolute flex flex-col items-center justify-center ${textColorClass}`}>
        <span
          key={displayPercent}
          className={percentTextClass}
        >
          {displayPercent}%
        </span>
        <span className={completedTextClass}>
          {t("common.completed_short")} {total} / {completed}
        </span>
      </div>
    </div>
  );
}