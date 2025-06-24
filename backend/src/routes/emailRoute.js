const express = require('express');
const router = express.Router();
const { sendItemFoundNotification } = require('../services/emailService');

// POST /api/notify-owner
router.post('/', async (req, res) => {
    try {
        const {
            ownerName,
            ownerEmail,
            itemName,
            itemSerial,
            location,
            date,
            descrption,
            itemImage
        } = req.body;

        if (!ownerName || !ownerEmail || !itemName || !itemSerial) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        await sendItemFoundNotification({
            ownerName,
            ownerEmail,
            itemName,
            itemSerial,
            location,
            date,
            descrption,
            itemImage
        });

        return res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
