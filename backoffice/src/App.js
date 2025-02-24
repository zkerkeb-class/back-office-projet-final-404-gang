import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './index.css';
import Dashboard from './components/dashboard';
import ArtistesCrud from './components/artists/artist';
import AlbumsCrud from './components/albums/albums';
import TracksCrud from './components/tracks/tracks';
import PlaylistsCrud from './components/playlist/playlist';
import TracksCrudB from './components/tracks/tracks2.0';
import PrivateRoute from './PrivateRoute'; // Importer PrivateRoute
import Navbar from './components/navbar';
import SearchResults from './components/SearchResult';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />{' '}
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/artists"
          element={
            <PrivateRoute>
              <ArtistesCrud />{' '}
            </PrivateRoute>
          }
        />
        <Route
          path="/albums"
          element={
            <PrivateRoute>
              <AlbumsCrud />{' '}
            </PrivateRoute>
          }
        />
        <Route
          path="/tracks"
          element={
            <PrivateRoute>
              <TracksCrud />{' '}
            </PrivateRoute>
          }
        />
        <Route
          path="/tracksB"
          element={
            <PrivateRoute>
              <TracksCrudB />{' '}
            </PrivateRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <PrivateRoute>
              <PlaylistsCrud />{' '}
            </PrivateRoute>
          }
        />
        {/* Autres routes */}
      </Routes>
    </Router>
  );
}

export default App;
