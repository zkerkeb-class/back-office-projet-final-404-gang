import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/albums';
const API_ARTISTS_URL = 'http://localhost:3001/api/artists';

export default function AlbumsCrud() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [artistId, setArtistId] = useState('');
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  async function fetchAlbums() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Erreur de récupération des albums :', error);
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
    if (!title.trim() || !genre.trim() || !releaseDate || !artistId) return;

    const payload = { title, genre, releaseDate, artist: artistId };
    const method = idEdit ? 'PUT' : 'POST';
    const url = idEdit ? `${API_URL}/${idEdit}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchAlbums();
      resetForm();
    }
  }

  async function deleteAlbum(id) {
    if (window.confirm('Voulez-vous vraiment supprimer cet album ?')) {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchAlbums();
    }
  }

  function handleEdit(album) {
    setTitle(album.title);
    setGenre(album.genre);
    setReleaseDate(album.releaseDate.split('T')[0]);
    setArtistId(album.artist._id);
    setIdEdit(album._id);
  }

  function resetForm() {
    setTitle('');
    setGenre('');
    setReleaseDate('');
    setArtistId('');
    setIdEdit(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Albums</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'album"
        />
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
        />
        <input
          type="date"
          className="border p-2 w-full rounded mb-2"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
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
        {albums.map((album) => (
          <li
            key={album._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <div>
              <img
                src={album.images.thumbnail}
                alt={album.title}
                className="w-16 h-16 rounded-lg mr-4"
              />
              <p className="font-semibold">{album.title}</p>
              <p className="text-sm text-gray-600">
                Genre: {album.genre} | Artiste: {album.artist.name}
              </p>
              <p className="text-sm text-gray-500">
                Date de sortie:{' '}
                {new Date(album.releaseDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(album)}
                className="text-blue-500 mr-2"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteAlbum(album._id)}
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
