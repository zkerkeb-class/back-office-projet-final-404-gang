import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/tracks';
const API_ARTISTS_URL = 'http://localhost:3001/api/artists';

export default function TracksCrud() {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [artistId, setArtistId] = useState('');
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    fetchTracks();
    fetchArtists();
  }, []);

  async function fetchTracks() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error('Erreur de récupération des morceaux :', error);
    }
  }

  async function fetchArtists() {
    try {
      const response = await fetch(API_ARTISTS_URL);
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Erreur de récupération des artistes :', error);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !duration.trim() || !artistId) return;

    const payload = { title, duration, artist: artistId };
    const method = idEdit ? 'PUT' : 'POST';
    const url = idEdit ? `${API_URL}/${idEdit}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchTracks();
      resetForm();
    }
  }

  async function deleteTrack(id) {
    if (window.confirm('Voulez-vous vraiment supprimer ce morceau ?')) {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchTracks();
    }
  }

  function handleEdit(track) {
    setTitle(track.title);
    setDuration(track.duration);
    setArtistId(track.artist._id);
    setIdEdit(track._id);
  }

  function resetForm() {
    setTitle('');
    setDuration('');
    setArtistId('');
    setIdEdit(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Morceaux</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du morceau"
        />
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Durée (en secondes)"
        />
        <select
          className="border p-2 w-full rounded mb-2"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
        >
          <option value="">Sélectionner un artiste</option>
          {artists.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {idEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
      <ul className="space-y-4">
        {tracks.map((track) => (
          <li
            key={track._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-gray-600">
                Durée: {track.duration} sec
              </p>
              <p className="text-sm text-gray-500">
                Artiste: {track.artist.name}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(track)}
                className="text-blue-500 mr-2"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteTrack(track._id)}
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
