import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = 'http://localhost:3001/api/albums';

function TrackItem({ track, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-gray-200 rounded flex justify-between items-center"
    >
      <span>
        {index + 1}. {track.title}
      </span>
      <button
        className="text-red-500"
        onClick={() => track.onDelete(track._id)}
      >
        ❌
      </button>
    </li>
  );
}

export default function AlbumsCrud() {
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [newTrack, setNewTrack] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setAlbums(data);
  }

  async function fetchTracks(albumId) {
    const response = await fetch(`${API_URL}/${albumId}/tracks`);
    const data = await response.json();
    setTracks(data);
    setSelectedAlbum(albumId);
  }

  async function addTrack() {
    if (!newTrack.trim()) return;
    const response = await fetch(`${API_URL}/${selectedAlbum}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTrack }),
    });
    if (response.ok) {
      setNewTrack('');
      fetchTracks(selectedAlbum);
    }
  }

  async function deleteTrack(trackId) {
    const response = await fetch(
      `${API_URL}/${selectedAlbum}/tracks/${trackId}`,
      { method: 'DELETE' },
    );
    if (response.ok) fetchTracks(selectedAlbum);
  }

  async function updateTrackOrder(updatedTracks) {
    await fetch(`${API_URL}/${selectedAlbum}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tracks: updatedTracks.map((t, index) => ({ id: t._id, order: index })),
      }),
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tracks.findIndex((t) => t._id === active.id);
    const newIndex = tracks.findIndex((t) => t._id === over.id);
    const newOrder = arrayMove(tracks, oldIndex, newIndex);
    setTracks(newOrder);
    updateTrackOrder(newOrder);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestion des Albums</h2>
      <ul>
        {albums.map((album) => (
          <li
            key={album._id}
            className="p-2 bg-gray-100 rounded flex justify-between items-center cursor-pointer"
            onClick={() => fetchTracks(album._id)}
          >
            {album.title}
          </li>
        ))}
      </ul>
      {selectedAlbum && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Pistes de l'album</h3>
          <input
            type="text"
            value={newTrack}
            onChange={(e) => setNewTrack(e.target.value)}
            placeholder="Nouvelle piste"
            className="border p-2 w-full rounded mt-2"
          />
          <button
            onClick={addTrack}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Ajouter
          </button>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tracks.map((t) => t._id)}>
              <ul className="mt-4 space-y-2">
                {tracks.map((track, index) => (
                  <TrackItem
                    key={track._id}
                    track={{ ...track, onDelete: deleteTrack }}
                    index={index}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
