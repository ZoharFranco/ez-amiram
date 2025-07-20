'use client';

import '@/frontend/components/ChartSetup';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import ActionButton from '@/frontend/components/shared/ActionButton';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { Button } from '@headlessui/react';
import { TestTube2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { theme } from '@/frontend/theme';

type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
};

type SimulationHistory = {
    id: number;
    date: string;
    total: number;
    reading: number;
    listening: number;
    writing: number;
    questions: Question[];
    userAnswers: number[];
};

const mockHistory: SimulationHistory[] = [
    {
        id: 1,
        date: '20/05',
        total: 108,
        reading: 110,
        listening: 100,
        writing: 120,
        questions: [],
        userAnswers: [0, 1],
    },
    {
        id: 2,
        date: '21/05',
        total: 110,
        reading: 110,
        listening: 115,
        writing: 105,
        questions: [],
        userAnswers: [1, 1],
    },
    {
        id: 3,
        date: '22/05',
        total: 120,
        reading: 125,
        listening: 115,
        writing: 119,
        questions: [],
        userAnswers: [0, 0],
    },
];

type ScoreKey = 'total' | 'reading' | 'listening' | 'writing';
const scoreTypes: { key: ScoreKey; label: string }[] = [
    { key: 'total', label: 'total' },
    { key: 'reading', label: 'reading' },
    { key: 'listening', label: 'listening' },
    { key: 'writing', label: 'writing' },
];

export default function Simulation() {
    const router = useRouter();
    const { t } = useLanguage();
    const [selectedScore, setSelectedScore] = useState<ScoreKey>('total');

    const chartData = {
        labels: mockHistory.map((sim) => sim.date),
        datasets: [
            {
                label: scoreTypes.find(s => s.key === selectedScore)?.label,
                data: mockHistory.map(sim => sim[selectedScore]),
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                tension: 0.3,
            },
        ],
    };

    return (
        <ClientLayout>
            <div className="container mx-auto px-4 py-10">
                <PageTitle title={t('pages.simulations.title')} subtitle={t('pages.simulations.subtitle')} color='orange' />
                <main className="px-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group flex items-center justify-center">
                            {/* Modern button design */}
                        <ActionButton 
                            color="orange"
                            className="text-base px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => router.push('/frontend/simulations/start')}
                        >
                            {t('pages.simulations.startNew') || 'התחל'}
                        </ActionButton>
                        </div>
                    </div>

                    {/* כרטיסי סימולציות */}
                    <div className="flex flex-col gap-4 mb-8" dir="rtl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-700 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                            סימולציות עבר
                        </h2>
                        {mockHistory.map(sim => (
                            <div
                                key={sim.id}
                                className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4 border border-gray-100 hover:shadow-md transition-all duration-200 w-full"
                            >
                                {/* Header: Date and Total Score */}
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-700">{sim.date}</span>
                                    <span className="text-orange-600 font-bold text-2xl sm:text-3xl md:text-4xl flex items-baseline gap-1">
                                        {Math.round(sim.total)}
                                        <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500">נק'</span>
                                    </span>
                                </div>
                                {/* Scores breakdown */}
                                <div className="flex justify-between text-base sm:text-lg md:text-xl text-gray-600">
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-800">{Math.round(sim.reading)}</span>
                                        <span className="text-xs sm:text-sm md:text-base text-orange-600 mt-0.5">קריאה</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-800">{Math.round(sim.listening)}</span>
                                        <span className="text-xs sm:text-sm md:text-base text-orange-600 mt-0.5">הבנה שמיעתית</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-800">{Math.round(sim.writing)}</span>
                                        <span className="text-xs sm:text-sm md:text-base text-orange-600 mt-0.5">כתיבה</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl text-[${theme.orange.dark}] mb-4 font-bold">{t('pages.simulations.simulationGraph')}</h2>
                        <div className="h-54 flex items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-white">
                            <Line
                                data={{
                                    ...chartData,
                                    datasets: [
                                        {
                                            ...chartData.datasets[0],
                                            borderColor: theme.orange.base,
                                            backgroundColor: theme.orange.light,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: false },
                                    },
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 150,
                                            ticks: { stepSize: 20 },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </ClientLayout>
    );
} 