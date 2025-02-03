import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/artists';

export default function ArtistesCrud() {
  const [artistes, setArtistes] = useState([]);
  const [nom, setNom] = useState('');
  const [genre, setGenre] = useState('');
  const [popularity, setPopularity] = useState(0);
  const [idEdit, setIdEdit] = useState(null);

  useEffect(() => {
    fetchArtistes();
  }, []);

  async function fetchArtistes() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setArtistes(data);
    } catch (error) {
      console.error('Erreur de récupération :', error);
    }
  }

  async function handleSubmit() {
    if (!nom.trim() || !genre.trim()) return;

    const payload = { name: nom, genre, popularity };
    const method = idEdit ? 'PUT' : 'POST';
    const url = idEdit ? `${API_URL}/${idEdit}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      fetchArtistes();
      resetForm();
    }
  }

  async function deleteArtiste(id) {
    if (window.confirm('Voulez-vous vraiment supprimer cet artiste ?')) {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchArtistes();
    }
  }

  function handleEdit(artiste) {
    setNom(artiste.name);
    setGenre(artiste.genre);
    setPopularity(artiste.popularity);
    setIdEdit(artiste._id);
  }

  function resetForm() {
    setNom('');
    setGenre('');
    setPopularity(0);
    setIdEdit(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Artistes</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de l'artiste"
        />
        <input
          type="text"
          className="border p-2 w-full rounded mb-2"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
        />
        <input
          type="number"
          className="border p-2 w-full rounded mb-2"
          value={popularity}
          onChange={(e) => setPopularity(Number(e.target.value))}
          placeholder="Popularité"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {idEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
      <ul className="space-y-4">
        {artistes.map((artiste) => (
          <li
            key={artiste._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{artiste.name}</p>
              <p className="text-sm text-gray-600">
                Genre: {artiste.genre} | Popularité: {artiste.popularity}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(artiste)}
                className="text-blue-500 mr-2"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteArtiste(artiste._id)}
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
