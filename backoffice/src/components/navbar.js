import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Back Office Dashboard</h1>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
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
            <Link
              to="/artists"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Artistes
            </Link>
          </li>
          <li>
            <Link
              to="/albums"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Albums
            </Link>
          </li>
          <li>
            <Link
              to="/tracks"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Titres
            </Link>
          </li>
          <li>
            <Link
              to="/tracksB"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Titres B
            </Link>
          </li>
          <li>
            <Link
              to="/playlists"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Playlists
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Déconnexion
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              >
                Connexion
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
