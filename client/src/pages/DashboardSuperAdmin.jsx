"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCards from "../components/SummaryCards";
import ReservationsTable from "../components/ReservationsTable";
import EventsTable from "../components/EventsTable";
import TalentsTable from "../components/TalentsTable";
import ReportsChart from "../components/ReportsChart";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState([
    { label: "Réservations", value: 0 },
    { label: "Événements", value: 0 },
    { label: "Talents", value: 0 },
    { label: "Rapports", value: 0 },
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await api.get("/dashboard/stats");
        if (statsResponse.data) {
          setStats([
            {
              label: "Réservations",
              value: statsResponse.data.reservations || 0,
            },
            { label: "Événements", value: statsResponse.data.events || 0 },
            { label: "Talents", value: statsResponse.data.talents || 0 },
            { label: "Rapports", value: statsResponse.data.reports || 0 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Keep default stats if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">
              Administration Centrale
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Bienvenue dans votre espace super administrateur
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards stats={stats} />

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 overflow-hidden">
          {/* Tabs navigation */}
          <div className="px-6 pt-6 border-b border-[oklch(0.922_0_0)]">
            <div className="flex overflow-x-auto hide-scrollbar">
              <button
                onClick={() => handleTabChange("overview")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="hidden md:inline">Vue d'ensemble</span>
              </button>

              <button
                onClick={() => handleTabChange("reservations")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "reservations"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="hidden md:inline">Réservations</span>
              </button>

              <button
                onClick={() => handleTabChange("events")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "events"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden md:inline">Événements</span>
              </button>

              <button
                onClick={() => handleTabChange("talents")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "talents"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="hidden md:inline">Talents</span>
              </button>

              <button
                onClick={() => handleTabChange("reports")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "reports"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden md:inline">Rapports</span>
              </button>

              <button
                onClick={() => handleTabChange("settings")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-[oklch(47.3%_0.137_46.201)] text-[oklch(47.3%_0.137_46.201)]"
                    : "border-transparent text-[oklch(0.556_0_0)] hover:text-[oklch(0.3_0_0)]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden md:inline">Paramètres</span>
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
                        Aperçu des activités
                      </h2>
                      <ReportsChart />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                          Réservations récentes
                        </h2>
                        <button
                          onClick={() => handleTabChange("reservations")}
                          className="text-sm text-[oklch(47.3%_0.137_46.201)] hover:underline"
                        >
                          Voir tout
                        </button>
                      </div>
                      <ReservationsTable limit={5} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                          Événements à venir
                        </h2>
                        <button
                          onClick={() => handleTabChange("events")}
                          className="text-sm text-[oklch(47.3%_0.137_46.201)] hover:underline"
                        >
                          Voir tout
                        </button>
                      </div>
                      <EventsTable limit={5} />
                    </div>
                  </div>
                )}

                {activeTab === "reservations" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des réservations
                      </h2>
                    </div>
                    <ReservationsTable />
                  </div>
                )}

                {activeTab === "events" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des événements
                      </h2>
                    </div>
                    <EventsTable />
                  </div>
                )}

                {activeTab === "talents" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des talents
                      </h2>
                    </div>
                    <TalentsTable />
                  </div>
                )}

                {activeTab === "reports" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Rapports et statistiques
                      </h2>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          Exporter
                        </button>
                      </div>
                    </div>
                    <ReportsChart />
                  </div>
                )}

                {activeTab === "settings" && (
                  <div>
                    <h2 className="text-lg font-semibold mb-6 text-[oklch(0.145_0_0)]">
                      Paramètres du tableau de bord
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                          Informations générales
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                              Nom de la plateforme
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                              defaultValue="Centre Culturel Ouarzazate"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                              Email de contact
                            </label>
                            <input
                              type="email"
                              className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                              defaultValue="contact@culture-ouarzazate.ma"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                              Fuseau horaire
                            </label>
                            <select className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]">
                              <option value="Africa/Casablanca">
                                Africa/Casablanca
                              </option>
                              <option value="Europe/Paris">Europe/Paris</option>
                              <option value="UTC">UTC</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                          Options de notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-[oklch(0.3_0_0)]">
                                Notifications par email
                              </h4>
                              <p className="text-sm text-[oklch(0.556_0_0)]">
                                Recevoir les notifications par email
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-[oklch(0.3_0_0)]">
                                Rapports hebdomadaires
                              </h4>
                              <p className="text-sm text-[oklch(0.556_0_0)]">
                                Recevoir un rapport hebdomadaire
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[oklch(0.922_0_0)]">
                      <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">
                        Sécurité et accès
                      </h3>
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
                                defaultValue="60"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-[oklch(0.3_0_0)]">
                                Journalisation des activités
                              </h4>
                              <p className="text-sm text-[oklch(0.556_0_0)]">
                                Enregistrer toutes les activités admin
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button className="px-6 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors mr-4">
                        Annuler
                      </button>
                      <button className="px-6 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors">
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
