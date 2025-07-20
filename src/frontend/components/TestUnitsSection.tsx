import { useRouter } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import ActionButton from './shared/ActionButton';

interface Topic {
  key: string;
  progress: number;
  title: string;
  description: string;
}

interface TestUnitsSectionProps {
  topics: Topic[];
}

export default function TestUnitsSection({ topics }: TestUnitsSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTopicClick = () => {
    router.push(`/frontend/questions`);
  };

  return (
    <section className="card p-10 mt-8 text-center">
      <div className="text-center mb-6">
        <h2 className="text-2xl">
          {t('pages.home.recentProgress')}
        </h2>
      </div>
      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.key}
            className="space-y-2 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg text-[rgb(var(--color-text))]">
                  {topic.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary text-sm">
                  {topic.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ActionButton
        className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8 text center text-lg"
        onClick={(e) => {
          e.stopPropagation();
          handleTopicClick();
        }}
      >
        {t('pages.home.questionsPractice')}
      </ActionButton>
    </section>
  );
}