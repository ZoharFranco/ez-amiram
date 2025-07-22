import { useRouter } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import ActionButton from './shared/ActionButton';

interface Topic {
  key: string;
  progress: number;
  title: string;
  description: string;
  questionsAnswered: number;
  totalQuestions: number;
}

interface TestUnitsSectionProps {
  topics: Topic[];
}

// Modern, engaging progress bar (like VocabularyProgress)
function TopicProgressBar({ progress }: { progress: number }) {
  // Color transitions: <50% red, 50-75% blue, >75% emerald
  let barColor = "bg-red-400";
  if (progress >= 75) barColor = "bg-emerald-500";
  else if (progress >= 50) barColor = "bg-blue-400";

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <div
        className={`h-full ${barColor} transition-all duration-700`}
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}

export default function TestUnitsSection({ topics }: TestUnitsSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTopicClick = (topicKey: string) => {
    router.push(`/frontend/questions?topic=${topicKey}`);
  };

  return (
    <section className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 shadow-sm p-8 sm:p-12 flex flex-col items-center space-y-8 sm:space-y-10 text-center">
      <div className="w-full text-center mb-2">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          {t('pages.home.recentProgress')}
        </h2>
      </div>
      <div className="w-full flex flex-col gap-6">
        {topics.map((topic) => (
          <div
            key={topic.key}
            className="group bg-gradient-to-br from-emerald-50 to-white border border-gray-100 rounded-xl p-5 sm:p-6 flex flex-col gap-2 shadow hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.025]"
            onClick={() => handleTopicClick(topic.key)}
            tabIndex={0}
            role="button"
            aria-label={topic.title}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
                  {topic.title}
                </span>
              </div>
              <span
                className={`text-lg sm:text-xl font-bold ${
                  topic.progress >= 75
                    ? "text-emerald-600"
                    : topic.progress >= 50
                    ? "text-blue-500"
                    : "text-red-500"
                }`}
              >
                {topic.progress}%
              </span>
            </div>
            <TopicProgressBar progress={topic.progress} />
            <div className="flex justify-between text-gray-500 text-sm sm:text-base mt-1">
              <div className="text-left">
                {topic.description}
              </div>
              <div className="text-right font-medium">
                {t('pages.home.questionsProgress', { answered: topic.questionsAnswered, total: topic.totalQuestions })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ActionButton
        className="mt-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-2xl sm:text-3xl"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/frontend/questions`);
        }}
      >
        {t('pages.home.questionsPractice')}
      </ActionButton>
    </section>
  );
}