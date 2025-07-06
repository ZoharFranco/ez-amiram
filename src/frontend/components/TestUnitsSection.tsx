import { ChartBarIcon } from '@heroicons/react/24/outline';

interface Topic {
  key: string;
  progress: number;
  title: string;
  description: string;
}

interface TestUnitsSectionProps {
  topics: Topic[];
  isRTL: boolean;
  t: (key: string) => string;
}

export default function TestUnitsSection({ topics, isRTL, t }: TestUnitsSectionProps) {
  return (
    <section className="card p-10 mt-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl">
          {t('pages.home.recentProgress')}
        </h2>
        <div className="badge badge-secondary">
          <ChartBarIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="space-y-8">
        {topics.map((topic, index) => (
          <div key={topic.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-subtitle text-[rgb(var(--color-text))]">
                {topic.title}
              </span>
              <span className="badge badge-primary text-lg">
                {topic.progress}%
              </span>
            </div>
            <div className="progress-bar h-3">
              <div
                className={`progress-bar-fill ${isRTL ? 'rotate-180' : ''}`}
                style={{
                  width: `${topic.progress}%`,
                  backgroundImage: `linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-${index % 2 ? 'secondary' : 'accent'})))`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 