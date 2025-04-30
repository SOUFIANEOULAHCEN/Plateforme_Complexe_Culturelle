"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Charts from "../components/Charts";
import api from "../api";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    userRoles: { utilisateurs: 0, admins: 0, superadmins: 0, talents: 0 },
    monthlyData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats({
          userRoles: response.data.userRoles,
          monthlyData: response.data.monthlyData.map(m => ({
            month: m.month,
            reservations: m.reservations,
            events: m.events
          }))
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          userRoles: { utilisateurs: 42, admins: 3, superadmins: 1, talents: 15 },
          monthlyData: [
            { month: 'Jan', reservations: 12, events: 5 },
            { month: 'Fév', reservations: 19, events: 8 },
            { month: 'Mar', reservations: 15, events: 6 },
          ]
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Rapports et statistiques</h1>
        </div>
        <Charts stats={stats} />
      </div>
    </DashboardLayout>
  );
}