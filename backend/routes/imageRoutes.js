const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadImage,getImages, getImageById, deleteImage, updateBorders } = require('../controllers/imageController');

router.post('/upload', verifyToken, upload.single('image'), uploadImage);
router.get('/', verifyToken, getImages)
router.get('/:id', verifyToken, getImageById)
router.delete('/:id', verifyToken, deleteImage)
router.put('/:id/borders', verifyToken, updateBorders)


module.exports = router;