import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import config from '../config';
import Navbar from './navbar';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
);

function Dashboard() {
  const [data, setData] = useState(null);
  const [preferences, setPreferences] = useState(
    JSON.parse(localStorage.getItem('preferences')) || [
      { id: 'cpu', name: 'Charge CPU', type: 'bar', threshold: 90 },
      {
        id: 'memory',
        name: 'Mémoire Système',
        type: 'doughnut',
        threshold: 80,
      },
      { id: 'redis', name: 'Opérations Redis', type: 'bar', threshold: 200 },
    ],
  );
  console.log(preferences.map((kpi) => kpi.id));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systemResponse, redisResponse] = await Promise.all([
          fetch(`${config.test.baseUrl}api/monitor/server/resources`),
          fetch(`${config.test.baseUrl}api/monitor/redis/stats`),
        ]);

        const systemData = await systemResponse.json();
        const redisData = await redisResponse.json();

        const fetchedData = {
          system: systemData,
          redis: redisData,
        };

        setData(fetchedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  if (!data) {
    return <p>Chargement des données...</p>;
  }

  // Données pour les graphiques
  const cpuChartData = {
    labels: data.system.cpu.perCore.map((_, index) => `Core ${index + 1}`),
    datasets: [
      {
        label: 'Utilisation des cœurs (%)',
        data: data.system.cpu.perCore.map((core) =>
          parseFloat(core.usage.replace('%', '')),
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const memoryDoughnutData = {
    labels: ['Utilisée', 'Libre'],
    datasets: [
      {
        data: [
          parseFloat(data.system.memory.used.replace(' GB', '')),
          parseFloat(data.system.memory.free.replace(' MB', '')) / 1024,
        ],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const redisBarData = {
    labels: ['Commandes totales', 'Hits', 'Misses'],
    datasets: [
      {
        label: 'Opérations Redis',
        data: [
          data.redis.operations.totalCommands,
          data.redis.operations.keyspaceHits,
          data.redis.operations.keyspaceMisses,
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  // Gestion du drag-and-drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(preferences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPreferences(items);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Bienvenue sur votre tableau de bord
        </h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="kpiList">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {preferences.map((kpi, index) => (
                  <Draggable
                    key={kpi.id}
                    draggableId={kpi.id} // Changed from String(kpi.id) to kpi.id
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white shadow-lg rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                          {kpi.name}
                        </h3>
                        {kpi.type === 'bar' && kpi.id === 'cpu' && (
                          <Bar data={cpuChartData} />
                        )}
                        {kpi.type === 'doughnut' && kpi.id === 'memory' && (
                          <Doughnut data={memoryDoughnutData} />
                        )}
                        {kpi.type === 'bar' && kpi.id === 'redis' && (
                          <Bar data={redisBarData} />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
      <footer className="bg-indigo-600 text-white text-center py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Back Office. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
