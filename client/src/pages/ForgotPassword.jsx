import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Toast from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setToast({ message: response.data.message, type: 'success' });
      setMessage(response.data.message);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Erreur lors de la demande de réinitialisation', type: 'error' });
      setError(err.response?.data?.message || 'Erreur lors de la demande de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(1_0_0)] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[oklch(0.145_0_0)]">
              Mot de passe oublié
            </h1>
            <p className="mt-1 text-[oklch(0.556_0_0)]">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>
          {/* Suppression des anciens messages */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[oklch(0.145_0_0)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-2 text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            <Link
              to="/login"
              className="text-[oklch(47.3%_0.137_46.201)] underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}