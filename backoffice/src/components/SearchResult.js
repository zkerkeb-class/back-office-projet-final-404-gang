import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchContent } from '../api/search.js';

const ResultSection = ({ title, items, type }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="group p-4 rounded-lg transition-all hover:bg-opacity-100 bg-white hover:bg-gray-100 cursor-pointer"
          >
            <div className="relative">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-md shadow-lg mb-4"
              />
              <button
                onClick={() => console.log(`Playing ${item.name}`)}
                className="absolute bottom-2 right-2 p-3 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg hover:scale-105"
              >
                ▶️
              </button>
            </div>
            <h3 className="font-semibold truncate">{item.name}</h3>
            <p className="text-sm truncate">
              {type === 'tracks'
                ? item.artist
                : type === 'albums'
                  ? item.artist
                  : 'Playlist'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: [],
  });

  useEffect(() => {
    if (query) {
      searchContent(query).then(setResults).catch(console.error);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-3xl font-bold mb-6">Résultats pour "{query}"</h1>
      <ResultSection title="Titres" items={results.tracks} type="tracks" />
      <ResultSection title="Artistes" items={results.artists} type="artists" />
      <ResultSection title="Albums" items={results.albums} type="albums" />
      <ResultSection
        title="Playlists"
        items={results.playlists}
        type="playlists"
      />
    </div>
  );
};

export default SearchResults;
