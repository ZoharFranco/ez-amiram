'use client';

import '@/frontend/components/ChartSetup';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { Button } from '@headlessui/react';
import { TestTube2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';



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
                            <Button
                                onClick={() => router.push('/frontend/simulations/start')}
                                className="relative w-60 h-24 flex items-center justify-center rounded-full text-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-blue-400/60 transition-all duration-200 mb-2 p-0"
                                style={{ minWidth: '15rem', minHeight: '6rem', letterSpacing: '0.03em' }}
                            >
                                <span className="mr-2 drop-shadow-lg tracking-wide animate-fade-in-scale">
                                    {t('pages.simulations.startNew')}
                                </span>
                                <TestTube2Icon className="h-10 w-10 ml-2 text-yellow-200 drop-shadow-md animate-fade-in-scale" />
                            </Button>
                        </div>
                    </div>


                    {/* כרטיסי סימולציות */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" dir="rtl">
                        <h2 className="text-2xl text-gray-900 mb-4 font-bold">סימולציות עבר</h2>
                        {mockHistory.map(sim => (
                            <div key={sim.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{sim.date}</span>
                                    <span className="text-blue-600 font-bold">{Math.round(sim.total)} נק'</span>
                                </div>
                                <div className="flex gap-2 text-xs text-gray-500">
                                    <span>קריאה: {Math.round(sim.reading)} נק'</span>
                                    <span>הבנה שמיעתית: {Math.round(sim.listening)} נק'</span>
                                    <span>כתיבה: {Math.round(sim.writing)} נק'</span>
                                </div>
                                <button
                                    className="mt-2 bg-gray-100 hover:bg-blue-50 text-blue-700 rounded px-3 py-1 text-xs font-medium"
                                >
                                    לצפייה בפרטים
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl text-gray-900 mb-4 font-bold">{t('pages.simulations.simulationGraph')}</h2>
                        <div className="flex gap-2 mb-4">
                            {scoreTypes.map(type => (
                                <SelectionButton
                                    key={type.key}
                                    onClick={() => setSelectedScore(type.key)}
                                    text={t(`pages.simulations.graph.${type.label}`)}
                                    selected={selectedScore === type.key}
                                />
                            ))}
                        </div>
                        <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-white">
                            <Line
                                data={chartData}
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