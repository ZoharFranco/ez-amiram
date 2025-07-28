'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/frontend/stores/simulation-store';
import { db } from '@/backend/services/external/firebase/firebase';
import SimulationRunPage from '@/frontend/components/ui/pages/simulations/simulationRunPage';

export default function SimulationStartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const simId = searchParams.get('id');
  const fetchSimulationById = useSimulationStore(state => state.fetchSimulationById);
  const simulationLoading = useSimulationStore(state => state.simulationLoading);
  const currentSimulation = useSimulationStore(state => state.currentSimulation);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (db && simId) {
      fetchSimulationById(db, simId)
        .then(() => setSimulationStarted(true))
        .catch(() => setError('Failed to load simulation.'));
    }
  }, [simId]);

  const handleStartSimulation = () => {
    if (db) {
      fetchSimulationById(db, '')
        .then(() => setSimulationStarted(true))
        .catch(() => setError('Failed to create simulation.'));
    }
  };

  if (simulationLoading) return <div>Loading simulation...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (simulationStarted && currentSimulation) return <SimulationRunPage simulation={currentSimulation} />;

  // Show simulation creation page if not started and no id
  if (!simulationStarted && !simId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 py-10">
        <div className="bg-white rounded-xl shadow p-8 flex flex-col gap-8 max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-2 text-orange-700">Start a New Simulation</h1>
          <p className="text-gray-700 mb-4">A full simulation includes all question types and mimics the real test. Click below to generate a new simulation.</p>
          <button
            className="btn btn-primary px-8 py-3 text-lg"
            onClick={handleStartSimulation}
          >
            Start Simulation
          </button>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => router.replace('/frontend/simulations')}
          >
            Back to Simulations
          </button>
        </div>
      </div>
    );
  }

  // Fallback: if not started and not loading, redirect to simulations page
  if (!simulationStarted && !simulationLoading) {
    router.replace('/frontend/simulations');
    return null;
  }

  return null;
}
