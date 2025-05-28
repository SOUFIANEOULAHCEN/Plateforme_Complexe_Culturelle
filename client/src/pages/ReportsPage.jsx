"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Charts from "../components/Charts";
import SummaryCards from "../components/SummaryCards";
import jsPDF from "jspdf";
import api from "../api";
import ReportsChart from "../components/ReportsChart";

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

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 20;

      // Couleurs du projet
      const colors = {
        primary: [139, 69, 19],    // Brown-700
        secondary: [180, 83, 9],   // Brown-600
        accent: [194, 65, 12],     // Brown-500
        success: [34, 197, 94],    // Green-500
        warning: [234, 179, 8],    // Yellow-500
        danger: [239, 68, 68],     // Red-500
        text: [17, 24, 39],        // Gray-900
        lightText: [107, 114, 128],// Gray-500
        background: [254, 242, 242]// Brown-50
      };

      // Fonction pour dessiner un rectangle arrondi
      const drawRoundedRect = (x, y, width, height, radius) => {
        doc.setDrawColor(...colors.primary);
        doc.setFillColor(...colors.background);
        doc.roundedRect(x, y, width, height, radius, radius, 'FD');
      };

      // En-tête moderne
      drawRoundedRect(margin - 5, yPosition - 15, pageWidth - (margin * 2) + 10, 60, 3);
      doc.setFontSize(28);
      doc.setTextColor(...colors.primary);
      doc.text("Rapports et Statistiques", pageWidth/2, yPosition + 10, { align: 'center' });
      
      // Date de génération avec style moderne
      doc.setFontSize(12);
      doc.setTextColor(...colors.lightText);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth/2, yPosition + 25, { align: 'center' });

      yPosition += 60;

      // Section Résumé avec style moderne
      drawRoundedRect(margin - 5, yPosition - 5, pageWidth - (margin * 2) + 10, 80, 3);
      doc.setFontSize(18);
      doc.setTextColor(...colors.primary);
      doc.text("Résumé des Statistiques", margin, yPosition + 10);
      
      yPosition += 20;
      doc.setFontSize(12);
      stats.summaryStats.forEach((stat, index) => {
        const statColors = [
          colors.primary,    // Brown
          colors.secondary,  // Brown-600
          colors.accent,     // Brown-500
          colors.warning     // Yellow
        ];
        
        doc.setFillColor(...statColors[index]);
        doc.circle(margin + 5, yPosition, 3, 'F');
        doc.setTextColor(...colors.text);
        doc.text(`${stat.label}: ${stat.value}`, margin + 15, yPosition + 3);
        yPosition += 15;
      });

      yPosition += 20;

      // Section Utilisateurs avec style moderne
      drawRoundedRect(margin - 5, yPosition - 5, pageWidth - (margin * 2) + 10, 80, 3);
      doc.setFontSize(18);
      doc.setTextColor(...colors.primary);
      doc.text("Répartition des Utilisateurs", margin, yPosition + 10);
      
      yPosition += 20;
      doc.setFontSize(12);
      Object.entries(stats.userRoles).forEach(([role, count], index) => {
        const roleColors = [
          colors.primary,    // Brown
          colors.secondary,  // Brown-600
          colors.accent,     // Brown-500
          colors.warning     // Yellow
        ];
        
        doc.setFillColor(...roleColors[index]);
        doc.circle(margin + 5, yPosition, 3, 'F');
        doc.setTextColor(...colors.text);
        doc.text(`${role}: ${count}`, margin + 15, yPosition + 3);
        yPosition += 15;
      });

      yPosition += 20;

      // Section Mensuelle avec style moderne
      drawRoundedRect(margin - 5, yPosition - 5, pageWidth - (margin * 2) + 10, 120, 3);
      doc.setFontSize(18);
      doc.setTextColor(...colors.primary);
      doc.text("Statistiques Mensuelles", margin, yPosition + 10);
      
      yPosition += 20;
      doc.setFontSize(12);
      stats.monthlyData.forEach(month => {
        if (yPosition > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Ligne de séparation
        doc.setDrawColor(...colors.lightText);
        doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
        
        doc.setTextColor(...colors.text);
        doc.setFontSize(14);
        doc.text(month.month, margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(...colors.lightText);
        doc.text(`Réservations: ${month.reservations}`, margin + 10, yPosition);
        yPosition += 8;
        doc.text(`Événements: ${month.events}`, margin + 10, yPosition);
        yPosition += 15;
      });

      yPosition += 20;

      // Attendre que les graphiques soient chargés
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fonction pour ajouter un graphique
      const addChart = async (selector, title) => {
        const chartHeight = 120; // Hauteur du graphique et de son conteneur arrondi
        const titleHeight = 20; // Hauteur du titre
        const spacingAfter = 20; // Espace après le graphique
        const totalHeightNeeded = chartHeight + titleHeight + spacingAfter;

        // Vérifier si on a besoin d'une nouvelle page (en tenant compte du pied de page)
        if (yPosition + totalHeightNeeded > doc.internal.pageSize.getHeight() - 30) { // 30 pour le pied de page et sa marge
          doc.addPage();
          yPosition = 20; // Commencer un peu plus bas sur la nouvelle page
        }

        const canvas = document.querySelector(selector);
        if (canvas) {
          // Ajouter le titre
          doc.setFontSize(16);
          doc.setTextColor(...colors.primary);
          doc.text(title, margin, yPosition + 10);
          yPosition += titleHeight;

          // Ajouter le graphique
          drawRoundedRect(margin - 5, yPosition - 5, pageWidth - (margin * 2) + 10, 120, 3);
          const chartImage = canvas.toDataURL();
          doc.addImage(chartImage, 'PNG', margin, yPosition, pageWidth - (margin * 2), 100);
          yPosition += chartHeight;

          // Ajouter un espace après le graphique
          yPosition += spacingAfter;
        }
      };

      // Ajouter tous les graphiques disponibles en utilisant les sélecteurs mis à jour
      await addChart('.reports-chart canvas', 'Répartition des Utilisateurs');
      await addChart('.line-chart-container canvas', 'Statistiques Mensuelles (Ligne)');
      await addChart('.bar-chart-container canvas', 'Statistiques Mensuelles (Barres)');

      // Pied de page moderne
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        
        // Ligne de séparation
        doc.setDrawColor(...colors.lightText);
        doc.line(margin, doc.internal.pageSize.getHeight() - 20, pageWidth - margin, doc.internal.pageSize.getHeight() - 20);
        
        doc.text(
          `Page ${i} sur ${totalPages}`,
          pageWidth/2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      doc.save("rapports-statistiques-complet.pdf");
    } catch (error) {
      console.error("Erreur lors de l'exportation du PDF:", error);
      alert("Une erreur est survenue lors de l'exportation du PDF. Veuillez réessayer.");
    }
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
      <div className="max-w-full mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Rapports et statistiques</h1>
          <div className="flex gap-2">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
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
          </div>
        </div>
        
        <div className="mb-12">
          <SummaryCards stats={stats.summaryStats} />
        </div>

        <div className="chart-container bg-white p-6 rounded-lg shadow">
          <Charts stats={stats} />
        </div>

        <div className="reports-chart bg-white p-6 rounded-lg shadow mt-8">
           <ReportsChart />
        </div>

      </div>
    </DashboardLayout>
  );
}