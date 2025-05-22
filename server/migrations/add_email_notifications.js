import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const up = async () => {
  try {
    await sequelize.query(`
      ALTER TABLE utilisateur
      ADD COLUMN email_notifications BOOLEAN DEFAULT true;
    `);
    console.log('Migration add_email_notifications completed successfully');
  } catch (error) {
    console.error('Error in migration add_email_notifications:', error);
    throw error;
  }
};

export const down = async () => {
  try {
    await sequelize.query(`
      ALTER TABLE utilisateur
      DROP COLUMN email_notifications;
    `);
    console.log('Migration add_email_notifications reverted successfully');
  } catch (error) {
    console.error('Error reverting migration add_email_notifications:', error);
    throw error;
  }
}; 