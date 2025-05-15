"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import api from "../api"
import Toast from "../components/Toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Validation de l'email
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsValidEmail(emailRegex.test(email))
    } else {
      setIsValidEmail(true) // Ne pas montrer d'erreur si le champ est vide
    }
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !isValidEmail) {
      setToast({
        message: "Veuillez entrer une adresse email valide",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/forgot-password", { email })
      setSubmitted(true)
      setToast({
        message: "Instructions envoyées ! Vérifiez votre boîte de réception.",
        type: "success",
      })
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Impossible d'envoyer les instructions. Veuillez réessayer."

      setToast({ message: errorMessage, type: "error" })
    } finally {
      setLoading(false)
    }
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

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
                  <p className="mt-2 text-gray-600">
                    Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`w-full rounded-lg border ${
                          !isValidEmail ? "border-red-500" : "border-gray-300"
                        } bg-white pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]`}
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {!isValidEmail && (
                      <p className="mt-1 text-sm text-red-600">Veuillez entrer une adresse email valide</p>
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
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer les instructions"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Vérifiez votre boîte de réception</h2>
                <p className="text-gray-600 mb-6">
                  Nous avons envoyé un lien de réinitialisation à <span className="font-medium">{email}</span>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(42%_0.137_46.201)] font-medium underline"
                >
                  Utiliser une autre adresse email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </motion.div>
    </div>
  )
}
