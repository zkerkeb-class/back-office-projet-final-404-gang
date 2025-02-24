import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSearchSuggestions } from '../api/search.js';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const results = await getSearchSuggestions(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Back Office Dashboard</h1>

        {/* Barre de recherche */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher..."
            className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            🔍
          </button>

          {/* Suggestions dynamiques */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white text-black mt-1 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </form>

        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:underline">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline">
              Profil
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:underline">
              Paramètres
            </Link>
          </li>
          <li>
            <Link to="/artists" className="hover:underline">
              Artistes
            </Link>
          </li>
          <li>
            <Link to="/albums" className="hover:underline">
              Albums
            </Link>
          </li>
          <li>
            <Link to="/tracks" className="hover:underline">
              Titres
            </Link>
          </li>
          <li>
            <Link to="/playlists" className="hover:underline">
              Playlists
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
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
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
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
