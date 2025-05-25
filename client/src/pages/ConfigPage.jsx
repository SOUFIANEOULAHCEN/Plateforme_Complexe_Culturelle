"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../components/DashboardLayout"
import Toast from "../components/Toast"
import api from "../api"
import Cookies from "js-cookie"

export default function ConfigPage() {
  const [loading, setLoading] = useState(false)
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [toast, setToast] = useState(null)
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Centre Culturel Ouarzazate",
    contactEmail: "contact@culture-ouarzazate.ma",
    timezone: "Africa/Casablanca",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    weeklyReports: false,
  })
  const [securitySettings, setSecuritySettings] = useState({
    sessionDuration: 60,
    activityLogging: true,
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const userRole = Cookies.get("userRole")

  const fetchConfig = async () => {
    try {
      const response = await api.get("/config")
      const config = response.data
      
      setGeneralSettings({
        platformName: config.platformName,
        contactEmail: config.contactEmail,
        timezone: config.timezone,
      })
      
      setNotificationSettings({
        emailNotifications: config.emailNotifications,
        weeklyReports: config.weeklyReports,
      })
      
      setSecuritySettings({
        sessionDuration: config.sessionDuration,
        activityLogging: config.activityLogging,
      })
    } catch (error) {
      setToast({
        type: "error",
        message: "Erreur lors du chargement de la configuration"
      })
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const configData = {
        platformName: generalSettings.platformName,
        contactEmail: generalSettings.contactEmail,
        timezone: generalSettings.timezone,
        sessionDuration: securitySettings.sessionDuration,
        emailNotifications: notificationSettings.emailNotifications,
        weeklyReports: notificationSettings.weeklyReports,
        activityLogging: securitySettings.activityLogging,
      }

      await api.put("/config", configData)
      setToast({
        type: "success",
        message: "Configuration mise à jour avec succès"
      })
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Erreur lors de la mise à jour de la configuration"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNewsletter = async () => {
    setSendingNewsletter(true);
    try {
      const response = await api.post("/complexe-config/send-newsletter");
      if (response.data.successCount > 0) {
        setToast({
          type: "success",
          message: `Newsletter envoyée avec succès à ${response.data.successCount} utilisateur(s)`
        });
      } else {
        throw new Error("Aucun destinataire n'a reçu la newsletter");
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Erreur lors de l'envoi de la newsletter"
      });
    } finally {
      setSendingNewsletter(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Configuration du système</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Gérez les paramètres du système</p>
          </div>
          {userRole === 'superadmin' && (
            <button
              onClick={handleSendNewsletter}
              disabled={sendingNewsletter}
              className={`px-6 py-2 mt-4 md:mt-0 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors ${sendingNewsletter ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {sendingNewsletter ? 'Envoi en cours...' : 'Envoyer une newsletter'}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <form onSubmit={handleSaveSettings}>
            <h2 className="text-lg font-semibold mb-6 text-[oklch(0.145_0_0)]">Paramètres du tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Informations générales</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Nom de la plateforme</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.platformName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Email de contact</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Fuseau horaire</label>
                    <select
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    >
                      <option value="Africa/Casablanca">Africa/Casablanca</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Options de notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Notifications par email</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Recevoir les notifications par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Rapports hebdomadaires</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Recevoir un rapport hebdomadaire</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyReports: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[oklch(0.922_0_0)]">
              <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Sécurité et accès</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                        Durée de session (minutes)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                        value={securitySettings.sessionDuration}
                        min={15}
                        max={240}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionDuration: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Journalisation des activités</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Enregistrer toutes les activités admin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={securitySettings.activityLogging}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            activityLogging: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}