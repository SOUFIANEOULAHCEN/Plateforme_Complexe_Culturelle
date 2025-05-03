"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"
import EventProposalsTable from "../components/EventProposalsTable"

export default function EventProposalsPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Gestion des propositions d'événements</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Consultez et gérez toutes les propositions d'événements</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <EventProposalsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}