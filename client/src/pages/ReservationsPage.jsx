"use client"

import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"
import ReservationsTable from "../components/ReservationsTable"
// import ReservationForm from "../components/ReservationForm"
import AdminReservationForm from "../components/AdminReservationForm"

export default function ReservationsPage() {
  const [loading, setLoading] = useState(false)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Function to handle successful reservation addition
  const handleReservationFormSuccess = () => {
    setShowReservationForm(false)
    setRefreshKey((prev) => prev + 1) // This will trigger ReservationsTable to reload
  }

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Gestion des réservations</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Consultez et gérez toutes les réservations</p>
          </div>
          {/* <button
            className="bg-orange-800 text-white px-6 py-2 rounded-lg"
            onClick={() => setShowReservationForm(true)}
          >
            Nouvelle réservation
          </button> */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <ReservationsTable key={refreshKey} />
        </div>
      </div>

      {/* ReservationForm Modal */}
      <AdminReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        onSuccess={handleReservationFormSuccess}
      />
    </DashboardLayout>
  )
}
