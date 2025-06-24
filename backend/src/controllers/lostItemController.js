// File: controllers/lostItemController.js

const lostItem = require('../models/lostItems');
const sharp = require('sharp');

// CREATE a new lost item with compressed Base64 image
exports.createLostItem = async (req, res) => {
    try {
        const newItem = req.body;

        if (req.file && req.file.buffer) {
            // Compress and resize image using sharp
            const compressedBuffer = await sharp(req.file.buffer)
                .resize({ width: 800 }) // Resize to max width
                .jpeg({ quality: 60 }) // Compress to JPEG with 60% quality
                .toBuffer();

            const base64Image = compressedBuffer.toString('base64');
            newItem.itemImage = `data:image/jpeg;base64,${base64Image}`;
        } else {
            return res.status(400).json({ message: 'Image is required.' });
        }

        const savedItem = new lostItem(newItem);
        await savedItem.save();

        res.status(201).json({ message: 'Lost Item created successfully' });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({ message: 'Error creating item', error });
    }
};

// GET all lost items
exports.getAllLostItems = async (req, res) => {
    try {
        const items = await lostItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lost items', error });
    }
};

// GET lost item by ID
exports.getLostItemById = async (req, res) => {
    try {
        const item = await lostItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item by ID', error });
    }
};

// UPDATE a lost item by ID
exports.updateLostItem = async (req, res) => {
    try {
        const updatedItem = await lostItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedItem)
            return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
};

// DELETE a lost item by ID
exports.deleteLostItem = async (req, res) => {
    try {
        const deletedItem = await lostItem.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};
