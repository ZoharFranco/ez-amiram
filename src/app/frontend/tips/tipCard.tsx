import { Tip, TipState } from "./types";



interface TipCardProps {
  tip: Tip;
  state: TipState;
  onClick: () => void;
  t: (key: string) => string;
}

export default function TipCard({ tip, state, onClick, t }: TipCardProps) {
  const baseClass =
    'p-6 rounded-2xl border transition-shadow duration-300 shadow-sm hover:shadow-md hover:scale-[1.015] cursor-pointer';
  const stateClass =
    state === 'read'
      ? 'bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] text-white border-transparent'
      : state === 'inwork'
      ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
      : 'bg-white border-gray-200 text-gray-700';

  return (
    <div className={`${baseClass} ${stateClass}`} onClick={onClick}>
      <div className="text-4xl mb-3">{tip.icon}</div>
      <h3 className="text-lg font-semibold mb-1 leading-snug tracking-tight">
        {tip.title}
      </h3>
      <p
        className={`text-sm ${
          state === 'read'
            ? 'text-white/90'
            : state === 'inwork'
            ? 'text-yellow-900'
            : 'text-gray-500'
        }`}
      >
        {tip.description}
      </p>
      <div className="mt-4 flex items-center text-xs font-medium">
        {state === 'read' ? (
          <span className="flex items-center gap-1">✅ {t('pages.tips.marked_as_read')}</span>
        ) : state === 'inwork' ? (
          <span className="flex items-center gap-1 animate-pulse">🛠️ {t('pages.tips.marked_as_inwork')}</span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400">👆 {t('pages.tips.click_to_mark')}</span>
        )}
      </div>
    </div>
  );
}
