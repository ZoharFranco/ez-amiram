'use client';

import '@/frontend/components/ChartSetup';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { Button } from '@headlessui/react';
import { motion } from 'framer-motion';
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
        date: '2024-06-01',
        total: 85,
        reading: 90,
        listening: 80,
        writing: 85,
        questions: [],
        userAnswers: [0, 1],
    },
    {
        id: 2,
        date: '2024-05-28',
        total: 78,
        reading: 80,
        listening: 75,
        writing: 79,
        questions: [],
        userAnswers: [1, 1],
    },
    {
        id: 3,
        date: '2024-05-20',
        total: 92,
        reading: 95,
        listening: 90,
        writing: 91,
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
                <PageTitle title={t('pages.simulations.title')} subtitle={t('pages.simulations.subtitle')} color='blue' />
                <main className="px-8 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center mb-10"
                    >
                        <div className="relative group flex items-center justify-center">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <Button
                                onClick={() => router.push('/frontend/simulations/start')}
                                className="relative w-56 h-20 flex items-center justify-center rounded-full text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-2 p-0"
                                style={{ minWidth: '14rem', minHeight: '5rem' }}
                            >
                                <span>{t('pages.simulations.startNew')}</span>
                                <TestTube2Icon className="h-8 w-8 mr-3 ml-3" />
                            </Button>
                        </div>
                    </motion.div>
                    {/* Past Simulations Chart */}
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
                                            max: 100,
                                            ticks: { stepSize: 20 },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    {/* Simulation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <h2 className="text-2xl text-gray-900 mb-4 font-bold">{t('pages.simulations.pastSimulations')}</h2>
                        {mockHistory.map(sim => (
                            <div key={sim.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{sim.date}</span>
                                    <span className="text-blue-600 font-bold">{sim.total}%</span>
                                </div>
                                <div className="flex gap-2 text-xs text-gray-500">
                                    <span>Reading: {sim.reading}%</span>
                                    <span>Listening: {sim.listening}%</span>
                                    <span>Writing: {sim.writing}%</span>
                                </div>
                                <button
                                    className="mt-2 bg-gray-100 hover:bg-blue-50 text-blue-700 rounded px-3 py-1 text-xs font-medium"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
                </div>
        </ClientLayout>
    );
} 