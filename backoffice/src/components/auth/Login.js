import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import config from '../../config';
function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);
  console.log(csrfToken);
  useEffect(() => {
    const checkAuthAndGetCsrf = async () => {
      // Vérifier si l'utilisateur est déjà connecté
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/');
        return;
      }

      try {
        // Récupérer le token CSRF
        const csrfResponse = await fetch(
          `${config.test.baseUrl}api/csrf-token`,
          {
            method: 'GET',
            credentials: 'include', // Important pour les cookies
          },
        );

        if (!csrfResponse.ok) {
          throw new Error('Impossible de récupérer le token CSRF');
        }

        const { csrfToken } = await csrfResponse.json();
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };

    checkAuthAndGetCsrf();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 2. Ensuite, faire la requête de connexion avec le token CSRF
      const response = await fetch(`${config.test.baseUrl}api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Ajouter le token CSRF dans les headers
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Vous pouvez ajouter ici un état pour afficher l'erreur à l'utilisateur
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-indigo-800">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez entrer vos identifiants pour continuer
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-label="Adresse email"
                aria-describedby="email-description"
                placeholder="exemple@domaine.com"
                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    email: e.target.value.toLowerCase(),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                aria-label="Mot de passe"
                placeholder="Votre mot de passe"
                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </div>
        </form>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-3 px-4 border border-indigo-600 rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer un nouveau compte
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
