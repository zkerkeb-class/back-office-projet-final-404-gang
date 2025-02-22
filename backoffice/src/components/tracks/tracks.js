import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/audio';
const API_URL_TRACKS = 'http://localhost:3001/api/tracks';
const API_ARTISTS_URL = 'http://localhost:3001/api/artists';
const API_ALBUMS_URL = 'http://localhost:3001/api/albums';

export default function TracksCrud() {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [file, setFile] = useState(null);
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    fetchTracks();
    fetchArtists();
    fetchAlbums();
  }, []);

  async function fetchTracks() {
    try {
      const response = await fetch(API_URL_TRACKS);
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

  async function fetchAlbums() {
    try {
      const response = await fetch(API_ALBUMS_URL);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Erreur de récupération des albums :', error);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !artistId || !albumId || (!idEdit && !file)) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token d\'authentification non trouvé');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artistId', artistId);
    formData.append('albumId', albumId);
    if (file) formData.append('audio', file);

    const method = idEdit ? 'PATCH' : 'POST';
    const url = idEdit ? `${API_URL}/${idEdit}` : `${API_URL}/upload`;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (response.ok) {
      fetchTracks();
      resetForm();
    } else {
      console.error('Erreur lors de l\'envoi du fichier.');
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
    setArtistId(track.artist._id);
    setAlbumId(track.album._id);
    setIdEdit(track._id);
  }

  function resetForm() {
    setTitle('');
    setArtistId('');
    setAlbumId('');
    setFile(null);
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
        <select
          className="border p-2 w-full rounded mb-2"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        >
          <option value="">Sélectionner un album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
        {!idEdit && (
          <input
            type="file"
            accept="audio/*"
            className="border p-2 w-full rounded mb-2"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}
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
                Durée: {track.duration ? `${track.duration} sec` : 'Non disponible'}
              </p>
              <p className="text-sm text-gray-500">
                Artiste: {track.artist?.name}
              </p>
              <p className="text-sm text-gray-500">
                Album: {track.album?.title}
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
