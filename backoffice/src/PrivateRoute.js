import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // Vérifie si l'utilisateur est connecté (par exemple, en vérifiant un token dans le localStorage ou un contexte)
  const isAuthenticated = localStorage.getItem('token'); // Exemple d'authentification basée sur un token

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est authentifié, afficher le composant enfant (la page demandée)
  return children;
}

export default PrivateRoute;
