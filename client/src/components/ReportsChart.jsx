"use client";

import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Pie } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

export default function ReportsChart() {
  const [pieData, setPieData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await api.get("/dashboard/summary?chart=users");

        // Ajuster l'ordre des données pour correspondre aux couleurs
        const orderedValues = [
          response.data.values[0], // Utilisateurs
          response.data.values[2], // Admins
          response.data.values[3], // Super Admins
          response.data.values[1], // Talents
        ];

        setPieData({
          labels: ["Utilisateurs", "Admins", "Super Admins", "Talents"],
          datasets: [
            {
              data: orderedValues,
              backgroundColor: [
                "#36A2EB", // Utilisateurs
                "#FF6384", // Admins
                "#4BC0C0", // Super Admins
                "#FFCE56", // Talents
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
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
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
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

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
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
          ref={chartRef}
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
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
