"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import api from "../api"
import Toast from "../components/Toast"
import backgroundImage from "../assets/background.webp"

export default function AuthForms({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  // Fonction utilitaire pour vérifier l'expiration du token JWT
  function isTokenExpired(token) {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 < Date.now()
    } catch (e) {
      return true
    }
  }

  useEffect(() => {
    const token = Cookies.get("jwt")
    if (token && isTokenExpired(token)) {
      Cookies.remove("jwt")
      Cookies.remove("userEmail")
      Cookies.remove("userRole")
      navigate("/login")
    }
  }, [navigate])

  const handleSuccess = () => {
    onClose()
  }

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-gray-500 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-gray-700"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-[600px] flex-col md:flex-row">
          {/* Image Section - Will swap sides based on login/register state */}
          <div
            className={`relative flex-1 transition-all duration-500 ${
              isLogin ? "order-1 md:order-1" : "order-1 md:order-2"
            }`}
          >
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(47.3%_0.137_46.201)]/10 to-[oklch(47.3%_0.137_46.201)]/40 z-10"></div>

            {/* Background image with reduced opacity */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white z-20">
              <h2 className="mb-2 text-3xl font-bold">{isLogin ? "Bienvenue" : "Rejoignez-nous"}</h2>
              <p className="mb-6 max-w-md text-white/90">
                {isLogin
                  ? "Connectez-vous pour accéder à votre compte et profiter de nos services exclusifs."
                  : "Créez un compte pour découvrir tous nos services et fonctionnalités."}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="rounded-full border-2 border-white/30 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                type="button"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </div>

            {/* Bottom text - similar to the screenshot */}
            <div className="absolute bottom-4 w-full text-center text-white/80 z-20">
              <p className="text-sm uppercase tracking-wider">OUARZAZATE</p>
            </div>
          </div>

          {/* Form Section */}
          <div
            className={`flex flex-1 items-center justify-center p-8 transition-all duration-500 ${
              isLogin ? "order-2 md:order-2" : "order-2 md:order-1"
            }`}
          >
            <div className="w-full max-w-md">
              {isLogin ? (
                <LoginForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  switchToRegister={() => setIsLogin(false)}
                  onSuccess={handleSuccess}
                />
              ) : (
                <RegisterForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  switchToLogin={() => setIsLogin(true)}
                  onSuccess={handleSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginForm({ showPassword, setShowPassword, switchToRegister, onSuccess }) {
  const [toast, setToast] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Try to authenticate with your actual API
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, utilisateur } = response.data

      // Store JWT and user info in secure cookies
      Cookies.set("jwt", token, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      })
      Cookies.set("userEmail", utilisateur.email, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      })
      Cookies.set("userRole", utilisateur.role, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      })

      // Redirect based on user role
      if (utilisateur.role === "superadmin") {
        navigate("/dashboard/superadmin")
      } else if (utilisateur.role === "admin") {
        navigate("/dashboard/admin")
      } else if (utilisateur.role === "talent") {
        navigate("/TalentProfil")
      } else if (utilisateur.role === "utilisateur") {
        navigate("/UserProfil")
      } else {
        navigate("/") // Redirection par défaut si le rôle n'est pas reconnu
      }
      onSuccess()
    } catch (err) {
      console.error("Login error:", err)
      setToast({
        message: err.response?.data?.message || "Erreur lors de la connexion.",
        type: "error",
      })
      setError(err.response?.data?.message || "Erreur lors de la connexion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[oklch(0.145_0_0)]">Connexion</h1>
        <p className="mt-2 text-[oklch(0.556_0_0)]">Entrez vos identifiants pour accéder à votre compte</p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
              Mot de passe
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[oklch(47.3%_0.137_46.201)] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-[oklch(0.922_0_0)] text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-[oklch(0.556_0_0)]">
            Se souvenir de moi
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-2.5 font-medium text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 disabled:opacity-70"
        >
          {loading ? (
            <svg
              className="mr-2 h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              Se connecter
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-[oklch(0.556_0_0)]">
            Pas de compte ?{" "}
            <button
              type="button"
              className="font-medium text-[oklch(47.3%_0.137_46.201)] hover:underline"
              onClick={switchToRegister}
            >
              S'inscrire
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

function RegisterForm({
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  switchToLogin,
  onSuccess,
}) {
  const [toast, setToast] = useState(null)
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      setToast({
        message: "Les mots de passe ne correspondent pas.",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/register", {
        nom,
        email,
        password,
      })

      setToast({
        message: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        type: "success",
      })
      setSuccess("Inscription réussie. Vous pouvez vous connecter.")
      setTimeout(() => {
        switchToLogin()
        onSuccess()
      }, 1500)
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Erreur lors de l'inscription.",
        type: "error",
      })
      setError(err.response?.data?.message || "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[oklch(0.145_0_0)]">Créer un compte</h1>
        <p className="mt-2 text-[oklch(0.556_0_0)]">Remplissez le formulaire pour créer votre compte</p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Nom complet
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Votre nom complet"
            className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Mot de passe
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Confirmer le mot de passe
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-2.5 font-medium text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 disabled:opacity-70"
        >
          {loading ? (
            <svg
              className="mr-2 h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              S'inscrire
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-[oklch(0.556_0_0)]">
            Déjà un compte ?{" "}
            <button
              type="button"
              className="font-medium text-[oklch(47.3%_0.137_46.201)] hover:underline"
              onClick={switchToLogin}
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
