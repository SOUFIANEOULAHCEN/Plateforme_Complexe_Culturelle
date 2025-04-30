import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Toast from '../components/Toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setToast({ message: 'Les mots de passe ne correspondent pas', type: 'error' });
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);

    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setToast({ message: response.data.message, type: 'success' });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Erreur lors de la réinitialisation', type: 'error' });
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
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
              Réinitialiser votre mot de passe
            </h1>
            <p className="mt-1 text-[oklch(0.556_0_0)]">
              Choisissez un nouveau mot de passe
            </p>
          </div>
          {/* Suppression des anciens messages */}
          {/* Affichage du toast */}
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
                htmlFor="password"
                className="block text-sm font-medium text-[oklch(0.145_0_0)]"
              >
                Nouveau mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[oklch(0.145_0_0)]"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-2 text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'En cours...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}