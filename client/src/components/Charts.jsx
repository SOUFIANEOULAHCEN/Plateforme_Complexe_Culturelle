"use client";

import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Charts({ stats }) {
  // Configuration du graphique circulaire
  const pieData = {
    labels: ["Utilisateurs", "Talents", "Admins", "Super Admins"],
    datasets: [{
      data: [
        stats.userRoles.utilisateurs,
        stats.userRoles.talents,
        stats.userRoles.admins,
        stats.userRoles.superadmins
      ],
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
      hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"]
    }]
  };

  // Configuration du graphique linéaire
  const lineData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: "Réservations",
        data: stats.monthlyData.map(d => d.reservations),
        borderColor: "#36A2EB",
        tension: 0.4
      },
      {
        label: "Événements",
        data: stats.monthlyData.map(d => d.events),
        borderColor: "#FFCE56",
        tension: 0.4
      }
    ]
  };

  // Configuration du graphique à barres
  const barData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: "Réservations",
        data: stats.monthlyData.map(d => d.reservations),
        backgroundColor: "#36A2EB",
        barThickness: 30
      },
      {
        label: "Événements",
        data: stats.monthlyData.map(d => d.events),
        backgroundColor: "#FFCE56",
        barThickness: 30
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique circulaire */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Répartition des utilisateurs</h3>
          <div className="h-80">
            <Pie 
              data={pieData}
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>

        {/* Graphique linéaire */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Activité mensuelle</h3>
          <div className="h-80">
            <Line
              data={lineData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Graphique à barres */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Comparaison mensuelle</h3>
        <div className="h-96">
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}