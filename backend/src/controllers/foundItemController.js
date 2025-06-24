// File: controllers/foundItemController.js

const foundItem = require('../models/foundItems');
const sharp = require('sharp');

// CREATE a new found item with compressed Base64 image
exports.createFoundItem = async (req, res) => {
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

        const savedItem = new foundItem(newItem);
        await savedItem.save();

        res.status(201).json({ message: 'found Item created successfully' });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({ message: 'Error creating item', error });
    }
};

// GET all found items
exports.getFoundItems = async (req, res) => {
    try {
        const items = await foundItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching found items', error });
    }
};

// GET found item by ID
exports.getFoundItemById = async (req, res) => {
    try {
        const item = await foundItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item by ID', error });
    }
};

// UPDATE a found item by ID
exports.updateFoundItem = async (req, res) => {
    try {
        const updatedItem = await foundItem.findByIdAndUpdate(
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

// DELETE a found item by ID
exports.deleteFoundItem = async (req, res) => {
    try {
        const deletedItem = await foundItem.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};

