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
                '#667EEA', // Bleu violet pour Utilisateurs
                '#F17C66', // Orange corail pour Admins
                '#4FD1C5', // Turquoise pour Super Admins
                '#FEB2B2', // Rose pâle pour Talents
              ],
              borderColor: '#ffffff', // Bordure blanche pour un meilleur contraste
              borderWidth: 2,
              hoverBackgroundColor: [
                '#5A67D8',
                '#E56250',
                '#48C7B8',
                '#FBD38D',
              ],
              hoverBorderColor: '#ffffff',
              hoverBorderWidth: 2,
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
              backgroundColor: ['#667EEA', '#F17C66', '#4FD1C5', '#FEB2B2'],
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverBackgroundColor: ['#5A67D8', '#E56250', '#48C7B8', '#FBD38D'],
              hoverBorderColor: '#ffffff',
              hoverBorderWidth: 2,
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
                labels: {
                  font: {
                    size: 14 // Augmenter la taille de la police de la légende
                  }
                }
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
                bodyFont: { // Augmenter la taille de la police du tooltip
                  size: 14
                }
              },
            },
            animation: { // Ajouter des animations
              animateRotate: true,
              animateScale: true
            }
          }}
        />
      </div>
    </div>
  );
}
