const express = require('express');
const router = express.Router();
const multer = require('multer');
const foundItemController = require('../controllers/foundItemController');

// Use in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', foundItemController.getFoundItems);
router.get('/:id', foundItemController.getFoundItemById);
router.post('/', upload.single('itemImage'), foundItemController.createFoundItem);
router.put('/:id', upload.single('itemImage'), foundItemController.updateFoundItem);
router.delete('/:id', foundItemController.deleteFoundItem);

module.exports = router;

