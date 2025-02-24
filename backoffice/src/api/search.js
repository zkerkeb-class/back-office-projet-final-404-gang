const API_BASE_URL = 'http://localhost:3001/api/'; // Remplace par l'URL de ton API

export const getSearchSuggestions = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}search/suggestions?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok)
      throw new Error('Erreur lors de la récupération des suggestions');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchContent = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Erreur lors de la recherche');
    return await response.json();
  } catch (error) {
    console.error(error);
    return { tracks: [], artists: [], albums: [], playlists: [] };
  }
};
