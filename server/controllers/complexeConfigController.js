import ComplexeConfig from "../models/complexeConfig.js";

// Get current configuration
export const getComplexeConfig = async (req, res) => {
  try {
    let config = await ComplexeConfig.findOne();
    if (!config) {
      // Créer une configuration par défaut
      config = await ComplexeConfig.create({
        platformName: "Centre Culturel Ouarzazate",
        contactEmail: "contact@culture-ouarzazate.ma",
        timezone: "Africa/Casablanca", 
        sessionDuration: 60,
        emailNotifications: true,
        weeklyReports: true,
        activityLogging: true,
        lastUpdated: new Date()
      });
    }
    res.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la configuration" });
  }
};

// Update configuration
export const updateComplexeConfig = async (req, res) => {
  try {
    const {
      platformName,
      contactEmail,
      timezone,
      sessionDuration,
      emailNotifications,
      weeklyReports,
      activityLogging
    } = req.body;

    // Validation des champs
    if (contactEmail && !contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    if (sessionDuration && (sessionDuration < 15 || sessionDuration > 240)) {
      return res.status(400).json({ message: "La durée de session doit être entre 15 et 240 minutes" });
    }

    let config = await ComplexeConfig.findOne();
    if (!config) {
      config = await ComplexeConfig.create({});
    }

    const updatedConfig = await config.update({
      platformName: platformName || config.platformName,
      contactEmail: contactEmail || config.contactEmail,
      timezone: timezone || config.timezone,
      sessionDuration: sessionDuration || config.sessionDuration,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : config.emailNotifications,
      weeklyReports: weeklyReports !== undefined ? weeklyReports : config.weeklyReports,
      activityLogging: activityLogging !== undefined ? activityLogging : config.activityLogging,
      lastUpdated: new Date(),
      lastUpdatedBy: req.user.id
    });

    res.json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la configuration" });
  }
};
