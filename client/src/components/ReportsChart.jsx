"use client";

import { useEffect, useState } from "react";
import api from "../api";
import { Pie } from "react-chartjs-2";

export default function ReportsChart() {
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await api.get("/reports?chart=users");
        setPieData({
          labels: response.data.labels,
          datasets: [
            {
              data: response.data.values,
              backgroundColor: [
                "#36A2EB", // Bleu pour utilisateurs
                "#FF6384", // Rose pour admins
                "#FFCE56", // Jaune pour talents
                "#4BC0C0", // Turquoise pour super admins
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching pie data:", error);
        // Fallback data
        setPieData({
          labels: ["Utilisateurs", "Admins", "Super Admins", "Talents"],
          datasets: [
            {
              data: [120, 5, 2, 18],
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
              ],
            },
          ],
        });
      }
    };

    fetchPieData();
  }, []);

  if (!pieData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-[oklch(0.145_0_0)]">
        Répartition des utilisateurs
      </h3>
      <div className="h-64">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}