// components/ExpandCategory.tsx

import { ChevronDown, ChevronUp } from 'lucide-react';
import ProgressBar from '../shared/progressBar';
import TipCard from './tipCard';
import { Category, TipState } from './types';

interface ExpandCategoryProps {
  category: Category;
  isExpanded: boolean;
  toggle: () => void;
  tipStates: Record<string, TipState>;
  onTipClick: (tipId: string) => void;
  t: (key: string) => string;
}

export default function ExpandCategory({
  category,
  isExpanded,
  toggle,
  tipStates,
  onTipClick,
  t
}: ExpandCategoryProps) {
  const completed = category.tips.filter(tip => tipStates[tip.id] === 'read').length;
  const inWork = category.tips.filter(tip => tipStates[tip.id] === 'inwork').length;
  const total = category.tips.length;
  const completedPercent = Math.round((completed / total) * 100);
  // const inWorkPercent = Math.round((inWork / total) * 100); // This variable is not used

  const highlight = completed > 0 || inWork > 0;

  return (
    <div className={`
      rounded-3xl p-6 transition-all duration-300
      ${highlight
        ? 'shadow-xl bg-gradient-to-br from-[rgb(var(--color-primary-light))] to-white/90 border border-[rgb(var(--color-primary))]'
        : 'shadow-lg bg-white/70 border border-gray-200'
      }
      transform hover:scale-[1.01] hover:shadow-2xl
    `}>
      <div className="flex flex-col"> {/* Changed to flex-col for better layout control */}
        <div className="flex justify-between items-start mb-4"> {/* Align items-start for icon/title */}
          <div className="flex items-center gap-4">
            <span className="text-5xl transition-transform duration-300 group-hover:rotate-6"> {/* Larger icon, subtle rotate */}
              {category.icon}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-800">
              {category.title}
            </h2>
          </div>
        </div>

        <p className="mb-4 text-base text-gray-700 leading-relaxed"> {/* Slightly larger base font for description */}
          {category.description}
        </p>

        <ProgressBar
          percent={completedPercent}
          completed={completed}
          total={total}
          inwork={inWork}
          t={t}
        />

        <div className="mb-6 text-base font-semibold text-[rgb(var(--color-primary-dark))] mt-4">
          {completed === total ? t('pages.tips.category_done') : t('pages.tips.category_motivation')}
        </div>

        {/* Dedicated expandable button for clarity */}
        <button
          onClick={toggle}
          className={`
            mt-4 py-3 px-6 rounded-full font-bold text-lg
            flex items-center justify-center gap-2
            transition-all duration-300 ease-in-out
            ${isExpanded
              ? 'bg-[rgb(var(--color-primary-dark))] text-white shadow-md hover:bg-[rgb(var(--color-primary))]'
              : 'bg-[rgb(var(--color-primary))] text-white shadow-md hover:bg-[rgb(var(--color-primary-dark))]'
            }
          `}
        >
          {isExpanded ? (
            <>
              {t('pages.tips.collapse_category')} <ChevronUp size={20} className="ml-2 transition-transform duration-300" />
            </>
          ) : (
            <>
              {t('pages.tips.expand_category')} <ChevronDown size={20} className="ml-2 transition-transform duration-300" />
            </>
          )}
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-200 animate-fade-in">
            {category.tips.map(tip => (
              <TipCard
                key={tip.id}
                tip={tip}
                state={tipStates[tip.id] || 'unread'}
                onClick={() => onTipClick(tip.id)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}