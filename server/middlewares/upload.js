import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Résoudre __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    // Déterminer le dossier de destination en fonction du type de fichier
    if (file.fieldname === 'image_profil') {
      uploadPath = path.join(__dirname, '../public/uploads/profiles/');
    } else {
      uploadPath = path.join(__dirname, '../public/uploads/EventAffiche/');
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // Préfixer le nom du fichier en fonction du type
    const prefix = file.fieldname === 'image_profil' ? 'image_profil-' : 'eventaffiche-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Accepter les images pour image_profil et affiche, et PDF pour cv
  if ((file.fieldname === 'image_profil' || file.fieldname === 'affiche') && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.fieldname === 'cv' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image ou un PDF'), false);
  }
};

// Créer l'instance multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  },
  fileFilter: fileFilter
});

export default upload;
