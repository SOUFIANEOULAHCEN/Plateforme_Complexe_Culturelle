const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, userController.updateProfile);
router.put('/me/password', auth, userController.changePassword);
router.post('/me/upload', auth, upload.single('image'), userController.uploadProfileImage);

module.exports = router; 