// dashboardController.js
import Evenement from "../models/evenement.js";
import Reservation from "../models/reservation.js";
import Utilisateur from "../models/utilisateur.js";
import Commentaire from "../models/commentaire.js";
import Espace from "../models/espace.js";
import { fn, col } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    // Correction de l'ordre des requêtes
    const [utilisateurs, talents, admins, superadmins] = await Promise.all([
      // Utilisateurs normaux (is_talent = false)
      Utilisateur.count({
        where: {
          role: "utilisateur",
          is_talent: false,
        },
      }),
      // Talents (is_talent = true)
      Utilisateur.count({
        where: {
          role: "utilisateur",
          is_talent: true,
        },
      }),
      // Admins
      Utilisateur.count({ where: { role: "admin" } }),
      // Super Admins
      Utilisateur.count({ where: { role: "superadmin" } }),
    ]);

    // Récupération des données mensuelles
    const reservationsData = await Reservation.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("date_reservation"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "reservations"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
      raw: true,
    });

    const eventsData = await Evenement.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("date_debut"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "events"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
      raw: true,
    });

    // Fusion des données
    const allMonths = [
      ...new Set([
        ...reservationsData.map((r) => r.month),
        ...eventsData.map((e) => e.month),
      ]),
    ].sort();

    const monthlyData = allMonths.map((month) => ({
      month,
      reservations:
        reservationsData.find((r) => r.month === month)?.reservations || 0,
      events: eventsData.find((e) => e.month === month)?.events || 0,
    }));
    res.json({
      userRoles: {
        utilisateurs, // 1
        talents, // 2
        admins, // 1
        superadmins, // 1
      },
      monthlyData,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};

export const getReportsData = async (req, res) => {
  try {
    const { timeframe = "month", chart } = req.query;

    if (chart === "users") {
      // Nouvelle logique de comptage
      const [utilisateurs, talents, admins, superadmins] = await Promise.all([
        Utilisateur.count({ where: { role: "utilisateur", is_talent: false } }),
        Utilisateur.count({ where: { role: "utilisateur", is_talent: true } }),
        Utilisateur.count({ where: { role: "admin" } }),
        Utilisateur.count({ where: { role: "superadmin" } }),
      ]);

      return res.json({
        labels: ["Utilisateurs", "Talents", "Admins", "Super Admins"],
        values: [utilisateurs, talents, admins, superadmins],
      });
    }

    // Le reste reste inchangé
    let dateFormat;
    switch (timeframe) {
      case "month":
        dateFormat = "%Y-%m";
        break;
      case "quarter":
        dateFormat = "Q %Y";
        break;
      case "year":
        dateFormat = "%Y";
        break;
      default:
        dateFormat = "%Y-%m";
    }

    const [reservations, events, users] = await Promise.all([
      Reservation.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date_reservation"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true,
      }),
      Evenement.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date_debut"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true,
      }),
      Utilisateur.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date_inscription"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true,
      }),
    ]);

    res.json({
      reservations: reservations.map((r) => ({
        label: r.label,
        value: r.value,
      })),
      events: events.map((e) => ({ label: e.label, value: e.value })),
      users: users.map((u) => ({ label: u.label, value: u.value })),
    });
  } catch (error) {
    console.error("Error fetching reports data:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des rapports",
      error: error.message,
    });
  }
};
