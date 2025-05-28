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
  // Ajout de nouvelles couleurs pour plus de variété
  success: "oklch(65% 0.15 142.5)",
  warning: "oklch(75% 0.15 85.5)",
  info: "oklch(60% 0.15 250.5)",
};

// Configuration commune pour tous les graphiques
const commonOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#1a1a1a",
      bodyColor: "#4a4a4a",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      usePointStyle: true,
      boxPadding: 4,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== undefined) {
            label += context.parsed.y;
          } else if (context.parsed !== undefined) {
            label += context.parsed;
          }
          return label;
        }
      }
    }
  }
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

  // Mise à jour des options du graphique circulaire
  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
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
    },
    cutout: '40%',
    radius: '90%'
  };

  // Mise à jour des options du graphique linéaire
  const lineOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  // Mise à jour des options du graphique à barres
  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          title: (context) => {
            const idx = context[0].dataIndex;
            const titles = stats.monthlyData[idx]?.reservationTitles || [];
            if (context[0].datasetIndex === 0 && titles.length > 0) {
              return [context[0].label, ...titles];
            }
            return context[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique circulaire */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Répartition des utilisateurs
          </h3>
          <div className="h-80">
            <Pie
              data={pieData}
              options={pieOptions}
            />
          </div>
        </div>

        {/* Graphique linéaire */}
        <div className="line-chart-container bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Activité mensuelle</h3>
          <div className="h-80">
            <Line
              data={lineData}
              options={lineOptions}
            />
          </div>
        </div>
      </div>

      {/* Graphique à barres */}
      <div className="bar-chart-container bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparaison mensuelle</h3>
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
