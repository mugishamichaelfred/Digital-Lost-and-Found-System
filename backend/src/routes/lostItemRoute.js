const express = require('express');
const router = express.Router();
const multer = require('multer');
const lostController = require('../controllers/lostItemController');

// Use in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', lostController.getAllLostItems);
router.get('/:id', lostController.getLostItemById);
router.post('/', upload.single('itemImage'), lostController.createLostItem);
router.put('/:id', upload.single('itemImage'), lostController.updateLostItem);
router.delete('/:id', lostController.deleteLostItem);

module.exports = router;
