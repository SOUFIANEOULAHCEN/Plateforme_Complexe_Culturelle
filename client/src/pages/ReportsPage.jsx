"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Charts from "../components/Charts";
import SummaryCards from "../components/SummaryCards";
import jsPDF from "jspdf";
import api from "../api";

// Styles CSS pour l'impression
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }

    .print-area, .print-area * {
      visibility: visible;
    }

    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      padding: 20px !important;
    }

    .no-print {
      display: none !important;
    }

    .chart-container canvas {
      max-width: 100% !important;
      height: 250px !important;
    }

    .summary-card {
      page-break-inside: avoid;
    }
  }
`;

export default function ReportsPage() {
  const [stats, setStats] = useState({
    userRoles: { utilisateurs: 0, admins: 0, superadmins: 0, talents: 0 },
    monthlyData: [],
    summaryStats: [
      { label: "Réservations", value: 0 },
      { label: "Événements", value: 0 },
      { label: "Talents", value: 0 },
      { label: "Utilisateurs", value: 0 }
    ]
  });

  const handlePrint = () => {
    const originalStyles = document.head.innerHTML;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = printStyles;
    document.head.appendChild(styleEl);
    
    window.print();
    
    setTimeout(() => {
      document.head.removeChild(styleEl);
    }, 500);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Rapports et Statistiques", 10, 15);

    // Date de génération
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 10, 25);

    // Données principales
    doc.setFontSize(12);
    let yPosition = 40;
    
    stats.summaryStats.forEach((stat, index) => {
      const colors = ["#36A2EB", "#FF6384", "#4BC0C0", "#FFCE56"];
      doc.setFillColor(colors[index]);
      doc.rect(10, yPosition - 5, 5, 5, 'F');
      doc.text(`${stat.label}: ${stat.value}`, 20, yPosition);
      yPosition += 10;
    });

    // Graphique
    const chartImage = document.querySelector('.chart-container canvas').toDataURL();
    doc.addImage(chartImage, 'PNG', 10, yPosition + 10, 180, 100);

    doc.save("rapports-statistiques.pdf");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        
        const totalReservations = response.data.monthlyData.reduce((acc, curr) => acc + curr.reservations, 0);
        const totalEvents = response.data.monthlyData.reduce((acc, curr) => acc + curr.events, 0);
        const totalUsers = Object.values(response.data.userRoles).reduce((a, b) => a + b, 0);

        setStats({
          userRoles: response.data.userRoles,
          monthlyData: response.data.monthlyData.map(m => ({
            month: m.month,
            reservations: m.reservations,
            events: m.events,
            reservationTitles: m.reservationTitles || [],
          })),
          summaryStats: [
            { label: "Réservations", value: totalReservations },
            { label: "Événements", value: totalEvents },
            { label: "Talents", value: response.data.userRoles.talents },
            { label: "Utilisateurs", value: response.data.userRoles.utilisateurs }
          ]
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({
          ...prev,
          summaryStats: [
            { label: "Réservations", value: 0 },
            { label: "Événements", value: 0 },
            { label: "Talents", value: 0 },
            { label: "Utilisateurs", value: 0 }
          ]
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto p-4 print-area">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 no-print">
          <h1 className="text-2xl font-bold text-gray-800">Rapports et statistiques</h1>
          <div className="flex gap-2">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              Exporter PDF
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimer
            </button>
          </div>
        </div>
        
        <div className="mb-12">
          <SummaryCards stats={stats.summaryStats} />
        </div>

        <div className="chart-container bg-white p-6 rounded-lg shadow">
          <Charts stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}