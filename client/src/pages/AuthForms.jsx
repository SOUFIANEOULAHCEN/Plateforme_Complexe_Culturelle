"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import api from "../api"
import Toast from "../components/Toast"
import backgroundImage from "../assets/background.webp"
import { useTranslation } from "react-i18next"

export default function AuthForms({ isOpen, onClose }) {
  const { t } = useTranslation();
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
          aria-label={t('close')}
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
              <h2 className="mb-2 text-3xl font-bold">{isLogin ? t('auth_welcome') : t('auth_join_us')}</h2>
              <p className="mb-6 max-w-md text-white/90">
                {isLogin
                  ? t('auth_login_description')
                  : t('auth_register_description')}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="rounded-full border-2 border-white/30 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                type="button"
              >
                {isLogin ? t('auth_create_account') : t('auth_login')}
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
  const { t } = useTranslation();
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
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, utilisateur } = response.data

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

      if (utilisateur.role === "superadmin") {
        navigate("/dashboard/superadmin")
      } else if (utilisateur.role === "admin") {
        navigate("/dashboard/admin")
      } else if (utilisateur.role === "talent") {
        navigate("/TalentProfil")
      } else if (utilisateur.role === "utilisateur") {
        navigate("/UserProfil")
      } else {
        navigate("/")
      }
      onSuccess()
    } catch (err) {
      console.error("Login error:", err)
      setToast({
        message: err.response?.data?.message || t('auth_login_error'),
        type: "error",
      })
      setError(err.response?.data?.message || t('auth_login_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[oklch(0.145_0_0)]">{t('auth_login')}</h1>
        <p className="mt-2 text-[oklch(0.556_0_0)]">{t('auth_login_subtitle')}</p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            {t('auth_email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t('auth_email_placeholder')}
            className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
              {t('auth_password')}
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[oklch(47.3%_0.137_46.201)] hover:underline"
            >
              {t('auth_forgot_password')}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? t('auth_hide_password') : t('auth_show_password')}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
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
              {t('auth_login_button')}
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
              {t('auth_register')}
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
  const { t } = useTranslation();
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "utilisateur",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth_password_mismatch'))
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/auth/register", {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      setToast({
        message: t('auth_register_success'),
        type: "success",
      })

      setTimeout(() => {
        switchToLogin()
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      setToast({
        message: err.response?.data?.message || t('auth_register_error'),
        type: "error",
      })
      setError(err.response?.data?.message || t('auth_register_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[oklch(0.145_0_0)]">{t('auth_register')}</h1>
        <p className="mt-2 text-[oklch(0.556_0_0)]">{t('auth_register_subtitle')}</p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
              {t('auth_lastname')}
            </label>
            <input
              id="nom"
              type="text"
              placeholder={t('auth_lastname_placeholder')}
              className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
              {t('auth_firstname')}
            </label>
            <input
              id="prenom"
              type="text"
              placeholder={t('auth_firstname_placeholder')}
              className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            {t('auth_email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t('auth_email_placeholder')}
            className="mt-1 block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            {t('auth_password')}
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? t('auth_hide_password') : t('auth_show_password')}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            {t('auth_confirm_password')}
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showConfirmPassword ? t('auth_hide_password') : t('auth_show_password')}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-2 text-white transition-colors hover:bg-[oklch(47.3%_0.137_46.201)]/90 disabled:opacity-50"
        >
          {loading ? t('auth_loading') : t('auth_register_button')}
        </button>
      </form>
    </div>
  )
}
