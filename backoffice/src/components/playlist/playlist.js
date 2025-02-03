import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/playlists';
const API_TRACKS_URL = 'http://localhost:3001/api/tracks';

export default function PlaylistsCrud() {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [name, setName] = useState('');
  const [trackIds, setTrackIds] = useState([]);
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    fetchPlaylists();
    fetchTracks();
  }, []);

  async function fetchPlaylists() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Erreur de récupération des playlists :', error);
    }
  }

  async function fetchTracks() {
    try {
      const response = await fetch(API_TRACKS_URL);
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error('Erreur de récupération des morceaux :', error);
    }
  }

  async function handleSubmit() {
    if (!name.trim() || trackIds.length === 0) return;

    const payload = { name, tracks: trackIds };
    const method = idEdit ? 'PUT' : 'POST';
    const url = idEdit ? `${API_URL}/${idEdit}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchPlaylists();
      resetForm();
    }
  }

  async function deletePlaylist(id) {
    if (window.confirm('Voulez-vous vraiment supprimer cette playlist ?')) {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchPlaylists();
    }
  }

  function handleEdit(playlist) {
    setName(playlist.name);
    setTrackIds(playlist.tracks.map((track) => track._id));
    setIdEdit(playlist._id);
  }

  function handleTrackSelect(trackId) {
    setTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId],
    );
  }

  function resetForm() {
    setName('');
    setTrackIds([]);
    setIdEdit(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Playlists</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la playlist"
        />
        <div className="mb-2">
          <h3 className="font-semibold">Sélectionner des morceaux</h3>
          <ul className="space-y-2">
            {tracks.map((track) => (
              <li key={track._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={trackIds.includes(track._id)}
                  onChange={() => handleTrackSelect(track._id)}
                  className="mr-2"
                />
                <span>{track.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {idEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
      <ul className="space-y-4">
        {playlists.map((playlist) => (
          <li
            key={playlist._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{playlist.name}</p>
              <p className="text-sm text-gray-600">
                {playlist.tracks.length} morceaux
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(playlist)}
                className="text-blue-500 mr-2"
              >
                ✏️
              </button>
              <button
                onClick={() => deletePlaylist(playlist._id)}
                className="text-red-500"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
