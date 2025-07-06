import { useRouter } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";

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

export default function TestUnitsSection({ topics }: TestUnitsSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTopicClick = () => {
    router.push(`/frontend/questions`);
  };

  return (
    <section className="card p-10 mt-8 text-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl">
          {t('pages.home.recentProgress')}
        </h2>
      </div>
      <div className="space-y-8">
        {topics.map((topic) => (
          <div
            key={topic.key}
            className="space-y-4 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
            onClick={() => handleTopicClick()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-subtitle text-[rgb(var(--color-text))]">
                  {topic.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary text-lg">
                  {topic.progress}%
                </span>

              </div>
            </div>
          </div>

        ))}
      </div>

      <button
        className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8 text center"
        onClick={(e) => {
          e.stopPropagation();
          handleTopicClick();
        }}
      >
        {t('pages.home.questionsPractice')}
      </button>

    </section>
  );
}