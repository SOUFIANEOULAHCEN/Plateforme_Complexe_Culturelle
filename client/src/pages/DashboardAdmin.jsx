"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCards from "../components/SummaryCards";
import ReservationsTable from "../components/ReservationsTable";
import EventsTable from "../components/EventsTable";
import TalentsTable from "../components/TalentsTable";
import UsersTable from "../components/UsersTable";
import EspacesTable from "../components/EspacesTable";
import CommentairesTable from "../components/CommentairesTable";
import ReportsChart from "../components/ReportsChart";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function DashboardAdmin() {
  const [stats, setStats] = useState([
    { label: "Réservations", value: 0 },
    { label: "Événements", value: 0 },
    { label: "Talents", value: 0 },
    { label: "Utilisateurs", value: 0 },
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Try to fetch stats from your API
        // If this endpoint doesn't exist yet, it will fall back to mock data
        const statsResponse = await api.get("/dashboard/stats");
        if (statsResponse.data) {
          setStats([
            {
              label: "Réservations",
              value: statsResponse.data.reservations || 0,
            },
            { label: "Événements", value: statsResponse.data.events || 0 },
            { label: "Talents", value: statsResponse.data.talents || 0 },
            { label: "Utilisateurs", value: statsResponse.data.users || 0 },
          ]);
        }
        setToast({
          message: "Données du tableau de bord chargées avec succès",
          type: "success",
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Use mock data for development
        setStats([
          { label: "Réservations", value: 0 },
          { label: "Événements", value: 0 },
          { label: "Talents", value: 0 },
          { label: "Utilisateurs", value: 0 },
        ]);
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
              Tableau de bord
            </h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">
              Bienvenue dans votre espace administrateur
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
                onClick={() => handleTabChange("users")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "users"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden md:inline">Utilisateurs</span>
              </button>

              <button
                onClick={() => handleTabChange("espaces")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "espaces"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="hidden md:inline">Espaces</span>
              </button>

              <button
                onClick={() => handleTabChange("commentaires")}
                className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "commentaires"
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="hidden md:inline">Commentaires</span>
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

                {activeTab === "users" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des utilisateurs
                      </h2>
                     
                    </div>
                    <UsersTable />
                  </div>
                )}

                {activeTab === "espaces" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des espaces
                      </h2>
                      
                    </div>
                    <EspacesTable />
                  </div>
                )}

                {activeTab === "commentaires" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Gestion des commentaires
                      </h2>
                      <button
                        onClick={() => navigate("/commentaires/new")}
                        className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
                      >
                        Ajouter un commentaire
                      </button>
                    </div>
                    <CommentairesTable />
                  </div>
                )}

                {activeTab === "reports" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
                        Rapports et statistiques
                      </h2>
                    </div>
                    <ReportsChart />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  );
}
