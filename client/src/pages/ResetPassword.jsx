"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2, ArrowLeft, Shield } from "lucide-react"
import api from "../api"
import Toast from "../components/Toast"

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  })
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState(null)
  const [countdown, setCountdown] = useState(3)

  // Vérifier si les mots de passe correspondent
  const passwordsMatch = formData.password === formData.confirmPassword

  // Évaluer la force du mot de passe
  useEffect(() => {
    if (formData.password) {
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasNumber = /\d/.test(formData.password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      const isLongEnough = formData.password.length >= 8

      let score = 0
      let feedback = ""

      if (isLongEnough) score += 1
      if (hasLowerCase && hasUpperCase) score += 1
      if (hasNumber) score += 1
      if (hasSpecialChar) score += 1

      if (score === 0) feedback = "Très faible"
      else if (score === 1) feedback = "Faible"
      else if (score === 2) feedback = "Moyen"
      else if (score === 3) feedback = "Fort"
      else feedback = "Très fort"

      setPasswordStrength({ score, feedback })
    } else {
      setPasswordStrength({ score: 0, feedback: "" })
    }
  }, [formData.password])

  // Gérer le compte à rebours après succès
  useEffect(() => {
    let timer
    if (success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (success && countdown === 0) {
      navigate("/")
    }
    return () => clearTimeout(timer)
  }, [success, countdown, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas", type: "error" })
      return
    }

    // Vérifier la force du mot de passe
    if (passwordStrength.score < 2) {
      setToast({
        message:
          "Votre mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      })

      setToast({ message: "Mot de passe réinitialisé avec succès!", type: "success" })
      setSuccess(true)
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe"
      setToast({ message: errorMessage, type: "error" })
    } finally {
      setLoading(false)
    }
  }

  // Rendu des indicateurs de force du mot de passe
  const renderPasswordStrengthBars = () => {
    return (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full ${
              passwordStrength.score >= level
                ? level === 1
                  ? "bg-red-500"
                  : level === 2
                    ? "bg-orange-500"
                    : level === 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  // Rendu des critères de mot de passe
  const renderPasswordCriteria = () => {
    const criteria = [
      {
        label: "Au moins 8 caractères",
        met: formData.password.length >= 8,
        icon: formData.password.length >= 8 ? CheckCircle : XCircle,
      },
      {
        label: "Lettres majuscules et minuscules",
        met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
        icon: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? CheckCircle : XCircle,
      },
      {
        label: "Au moins un chiffre",
        met: /\d/.test(formData.password),
        icon: /\d/.test(formData.password) ? CheckCircle : XCircle,
      },
      {
        label: "Au moins un caractère spécial",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        icon: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? CheckCircle : XCircle,
      },
    ]

    return (
      <div className="mt-3 space-y-1.5">
        {criteria.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <item.icon className={`h-4 w-4 mr-2 ${item.met ? "text-green-500" : "text-gray-400"}`} />
            <span className={item.met ? "text-gray-700" : "text-gray-500"}>{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-[oklch(47.3%_0.137_46.201)] transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>

          {!success ? (
            <>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Shield className="h-6 w-6 text-[oklch(47.3%_0.137_46.201)] mr-2" />
                  <h1 className="text-2xl font-bold text-gray-900">Réinitialiser votre mot de passe</h1>
                </div>
                <p className="text-gray-600">Créez un nouveau mot de passe sécurisé pour votre compte</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible.password ? "text" : "password"}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-gray-900 placeholder-gray-500 focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      placeholder="Votre nouveau mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {passwordVisible.password ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {formData.password && (
                    <>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex-1 mr-4">{renderPasswordStrengthBars()}</div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.score === 0
                              ? "text-gray-400"
                              : passwordStrength.score === 1
                                ? "text-red-500"
                                : passwordStrength.score === 2
                                  ? "text-orange-500"
                                  : passwordStrength.score === 3
                                    ? "text-yellow-600"
                                    : "text-green-600"
                          }`}
                        >
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      {renderPasswordCriteria()}
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={passwordVisible.confirmPassword ? "text" : "password"}
                      required
                      className={`w-full rounded-lg border ${
                        formData.confirmPassword && !passwordsMatch ? "border-red-500" : "border-gray-300"
                      } bg-white pl-10 pr-10 py-2.5 text-gray-900 placeholder-gray-500 focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]`}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                    >
                      {passwordVisible.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-4 py-3 text-white font-medium hover:bg-[oklch(42%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 disabled:opacity-70 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation en cours...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe réinitialisé !</h2>
              <p className="text-gray-600 mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion
                dans {countdown} secondes.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center rounded-lg bg-[oklch(47.3%_0.137_46.201)] px-6 py-2.5 text-white font-medium hover:bg-[oklch(42%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2 transition-colors"
              >
                Se connecter maintenant
              </button>
            </motion.div>
          )}
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </motion.div>
    </div>
  )
}
