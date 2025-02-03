import React, { useState, useEffect } from 'react';
import interact from 'interactjs';
import { Bar, Doughnut } from 'react-chartjs-2';
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
  const [alerts, setAlerts] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systemResponse, redisResponse] = await Promise.all([
          fetch(`${config.test.baseUrl}monitor/server/resources`),
          fetch(`${config.test.baseUrl}monitor/redis/stats`),
        ]);
        const systemData = await systemResponse.json();
        const redisData = await redisResponse.json();
        setData({ system: systemData, redis: redisData });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleThresholdChange = (id, value) => {
    setPreferences(
      preferences.map((kpi) =>
        kpi.id === id ? { ...kpi, threshold: value } : kpi,
      ),
    );
  };

  const handleNotification = (kpi, value) => {
    if (value >= kpi.threshold) {
      const alertMessage = `${kpi.name} a dépassé le seuil de ${kpi.threshold}! (${value})`;
      setAlerts((prevAlerts) => [...prevAlerts, alertMessage]);
      fetch('https://ntfy.sh/your-topic', {
        method: 'POST',
        body: alertMessage,
      });
    }
  };

  useEffect(() => {
    if (data) {
      preferences.forEach((kpi) => {
        let value = 0;
        if (kpi.id === 'cpu' && data.system?.cpu?.perCore) {
          value = Math.max(
            ...data.system.cpu.perCore.map((core) =>
              parseFloat(core.usage.replace('%', '')),
            ),
          );
        }
        if (kpi.id === 'memory' && data.system?.memory?.used)
          value = parseFloat(data.system.memory.used) || 0;
        if (kpi.id === 'redis' && data.redis?.operations?.totalCommands)
          value = parseFloat(data.redis.operations.totalCommands) || 0;
        handleNotification(kpi, value);
      });
    }
  }, [data]);

  useEffect(() => {
    interact('.draggable-card').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
      },
    });
  }, []);

  if (!data) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Bienvenue sur votre tableau de bord
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Notifications</h3>
          {alerts.length === 0 ? (
            <p className="text-gray-500">Aucune alerte.</p>
          ) : (
            <ul className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              {alerts.map((alert, index) => (
                <li key={index} className="mb-2">
                  {alert}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Configuration des KPIs</h3>
          {preferences.map((kpi) => (
            <div key={kpi.id} className="mb-4">
              <label>{kpi.name} - Seuil d'alerte: </label>
              <input
                type="number"
                value={kpi.threshold}
                onChange={(e) => handleThresholdChange(kpi.id, e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preferences.map((kpi) => (
            <div
              key={kpi.id}
              className="draggable-card bg-white shadow-lg rounded-lg p-6 cursor-move"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {kpi.name}
              </h3>
              {kpi.type === 'bar' && kpi.id === 'cpu' && (
                <Bar
                  data={{
                    labels: data.system.cpu.perCore.map(
                      (_, index) => `Core ${index + 1}`,
                    ),
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
                  }}
                />
              )}
              {kpi.type === 'doughnut' && kpi.id === 'memory' && (
                <Doughnut
                  data={{
                    labels: ['Utilisée', 'Libre'],
                    datasets: [
                      {
                        data: [
                          parseFloat(
                            data.system.memory.used.replace(' GB', ''),
                          ),
                          parseFloat(
                            data.system.memory.free.replace(' MB', ''),
                          ) / 1024,
                        ],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                      },
                    ],
                  }}
                />
              )}
              {kpi.type === 'bar' && kpi.id === 'redis' && (
                <Bar
                  data={{
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
                  }}
                />
              )}
            </div>
          ))}
        </div>
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
