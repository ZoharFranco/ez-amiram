'use client';

import '@/frontend/components/ChartSetup';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { theme } from '@/frontend/theme';
import { useSimulationStore } from '@/frontend/stores/simulation-store';
import { db } from '@/backend/services/external/firebase/firebase';
import { useAuth } from '@/frontend/hooks/use-auth';
import Spinner from '@/frontend/components/shared/spinner';

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
    const { user, loading: userLoading } = useAuth();
    const [selectedScore] = useState<ScoreKey>('total');
    const history = useSimulationStore(state => state.history);
    const fetchHistory = useSimulationStore(state => state.fetchHistory);
    const historyLoading = useSimulationStore(state => state.historyLoading);

    const handleStartSimulation = () => {
        router.push('/frontend/simulations/start');
    };

    useEffect(() => {
        if (user && db) {
            fetchHistory(db, user.uid);
        }
    }, [user, fetchHistory]);

    // Calculate chart data from history
    const chartData = {
        labels: history.map((sim) => new Date(sim.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: scoreTypes.find(s => s.key === selectedScore)?.label,
                data: history.map(sim => {
                    // Placeholder: you may want to calculate total/reading/listening/writing from answers
                    return sim.answers?.length || 0;
                }),
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                tension: 0.3,
            },
        ],
    };

    if (userLoading) return <Spinner />;

    return (
        <ClientLayout>
            <div className="container mx-auto px-4 py-10">
                <PageTitle title={t('pages.simulations.title')} subtitle={t('pages.simulations.subtitle')} color='orange' />
                <main className="px-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group flex items-center justify-center">
                            {/* List available simulations to start */}
                            <div className="mb-4">
                                <div className="mt-6 flex justify-center">
                                    <button
                                        className="px-8 py-3 text-lg rounded-lg font-semibold shadow bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
                                        onClick={handleStartSimulation}
                                    >
                                        Start New Full Simulation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-8" dir="rtl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-700 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                            סימולציות עבר
                        </h2>
                        {historyLoading && <Spinner />}
                        {history.length === 0 && !historyLoading && <div className="text-gray-500">No simulation history yet.</div>}
                        {history.map(sim => (
                            <div
                                key={sim.id}
                                className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4 border border-gray-100 hover:shadow-md transition-all duration-200 w-full"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-700">
                                            {sim.simulation?.name || 'Unknown Simulation'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(sim.timestamp).toLocaleDateString()} at {new Date(sim.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-orange-600 font-bold text-2xl sm:text-3xl md:text-4xl flex items-baseline gap-1">
                                            {sim.answers?.length || 0}
                                            <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500">answers</span>
                                        </span>
                                        {sim.simulation && (
                                            <div className="text-sm text-gray-500">
                                                {sim.simulation.stages?.length === 1 ? 'Quiz' : 'Full Simulation'} • {sim.simulation.stages?.length || 0} stages
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {sim.simulation && (
                                    <div className="flex flex-wrap gap-2">
                                        {sim.simulation.stages?.map((stage, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {stage.type}
                                            </span>
                                        ))}
                                    </div>
                                )}
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