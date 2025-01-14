import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Back Office Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/dashboard"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
              >
                Profil
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
              >
                Paramètres
              </Link>
            </li>
            <li>
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Bienvenue sur votre tableau de bord
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Statistique 1
            </h3>
            <p className="text-gray-500 mt-2">
              Description de la statistique 1.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Statistique 2
            </h3>
            <p className="text-gray-500 mt-2">
              Description de la statistique 2.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Statistique 3
            </h3>
            <p className="text-gray-500 mt-2">
              Description de la statistique 3.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Back Office . Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
