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

// Palette générée à partir de la couleur de base
const COLOR_PALETTE = {
  primary: "oklch(47.3% 0.137 46.201)", // Couleur de base
  secondary: "oklch(55% 0.12 46.2)", // Version plus claire
  tertiary: "oklch(40% 0.15 46.2)", // Version plus sombre
  complementary: "oklch(47% 0.13 226.2)", // Couleur complémentaire
};

export default function Charts({ stats }) {
  // Plugin pour afficher les titres sous chaque barre de réservation
  const reservationTitlesPlugin = {
    id: 'reservationTitlesPlugin',
    afterDraw: (chart) => {
      const { ctx, chartArea, scales, data } = chart;
      if (!ctx || !chartArea) return;
      ctx.save();
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      // Pour chaque mois, afficher les titres sous la barre de réservation
      stats.monthlyData.forEach((d, i) => {
        if (d.reservationTitles && d.reservationTitles.length > 0) {
          const x = scales.x.getPixelForValue(i);
          // Utiliser la couleur de la barre de réservation
          ctx.fillStyle = COLOR_PALETTE.primary;
          d.reservationTitles.forEach((title, j) => {
            ctx.fillText(
              title,
              x,
              chartArea.bottom + 12 + j * 12 // espace sous l'axe X
            );
          });
        }
      });
      ctx.restore();
    }
  };

  // Configuration du graphique circulaire
  const pieData = {
    labels: ["Utilisateurs", "Talents", "Admins", "Super Admins"],
    datasets: [
      {
        data: [
          stats.userRoles.utilisateurs,
          stats.userRoles.talents,
          stats.userRoles.admins,
          stats.userRoles.superadmins,
        ],
        backgroundColor: [
          COLOR_PALETTE.primary,
          COLOR_PALETTE.secondary,
          COLOR_PALETTE.tertiary,
          COLOR_PALETTE.complementary,
        ],
        hoverBackgroundColor: [
          "oklch(50% 0.15 46.2)",
          "oklch(58% 0.13 46.2)",
          "oklch(43% 0.16 46.2)",
          "oklch(50% 0.14 226.2)",
        ],
      },
    ],
  };

  // Configuration du graphique linéaire
  const lineData = {
    labels: stats.monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Réservations",
        data: stats.monthlyData.map((d) => d.reservations),
        borderColor: COLOR_PALETTE.primary,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Événements",
        data: stats.monthlyData.map((d) => d.events),
        borderColor: COLOR_PALETTE.complementary,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Configuration du graphique à barres
  const barData = {
    labels: stats.monthlyData.map((d) =>
      d.reservationTitles && d.reservationTitles.length > 0
        ? d.month + '\\n' + d.reservationTitles.join(', ')
        : d.month
    ),
    datasets: [
      {
        label: "Réservations",
        data: stats.monthlyData.map((d) => d.reservations),
        backgroundColor: COLOR_PALETTE.primary,
        barThickness: 30,
      },
      {
        label: "Événements",
        data: stats.monthlyData.map((d) => d.events),
        backgroundColor: COLOR_PALETTE.complementary,
        barThickness: 30,
      },
    ],
  };

  // Options pour afficher les titres au-dessus des barres de réservation
  const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          font: { size: 12 },
        },
        afterFit: (scale) => {
          scale.height = 80;
        }
      },
      y: { beginAtZero: true },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            // Affiche le mois + les titres de réservation dans le tooltip
            const idx = context[0].dataIndex;
            const titles = stats.monthlyData[idx]?.reservationTitles || [];
            if (context[0].datasetIndex === 0 && titles.length > 0) {
              return [context[0].label, ...titles];
            }
            return context[0].label;
          },
        },
      },
      datalabels: {
        display: true,
        align: 'end',
        anchor: 'end',
        formatter: (value, context) => {
          // Affiche les titres au-dessus des barres de réservation uniquement
          if (context.datasetIndex === 0) {
            const idx = context.dataIndex;
            const titles = stats.monthlyData[idx]?.reservationTitles || [];
            return titles.length > 0 ? titles.join('\n') : '';
          }
          return '';
        },
        font: {
          size: 10,
        },
        color: '#333',
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique circulaire */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Répartition des utilisateurs
          </h3>
          <div className="h-80">
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
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
                  y: { beginAtZero: true },
                },
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
            options={barOptions}
            plugins={[reservationTitlesPlugin]}
          />
        </div>
      </div>
    </div>
  );
}
