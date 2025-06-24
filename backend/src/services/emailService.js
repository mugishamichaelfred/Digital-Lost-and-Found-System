const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Sends a "lost item found" email notification to the item's owner.
 * 
 * @param {Object} itemDetails - The item and owner details
 * @param {string} itemDetails.ownerName - Name of the item owner
 * @param {string} itemDetails.ownerEmail - Email address of the owner
 * @param {string} itemDetails.itemName - Name of the item
 * @param {string} itemDetails.itemSerial - Serial number of the item
 * @param {string} itemDetails.location - Where it was found
 * @param {Date} itemDetails.date - Date the item was found
 * @param {string} [itemDetails.descrption] - Optional description
 * @param {string} [itemDetails.itemImage] - Optional image URL
 */
const sendItemFoundNotification = async (itemDetails) => {
    const {
        ownerName,
        ownerEmail,
        itemName,
        itemSerial,
        location,
        date,
        descrption,
        itemImage
    } = itemDetails;

    const formattedDate = new Date(date).toLocaleDateString();

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Good News, ${ownerName}!</h2>
            <p>Your lost item has been found and is now available for pickup.</p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Item Details:</h3>
                <p><strong>Item Name:</strong> ${itemName}</p>
                <p><strong>Serial Number:</strong> ${itemSerial}</p>
                <p><strong>Location Found:</strong> ${location}</p>
                <p><strong>Date Found:</strong> ${formattedDate}</p>
                ${descrption ? `<p><strong>Description:</strong> ${descrption}</p>` : ''}
                ${itemImage ? `<img src="${itemImage}" alt="Item Image" style="max-width:100%; margin-top:10px;" />` : ''}
            </div>

            <p>Please log into your dashboard to arrange pickup and confirm receipt:</p>
            <a href="${process.env.FRONTEND_URL}/userdash"
            style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Dashboard
            </a>

            <p style="margin-top: 20px;">Best regards,<br>Lost and Found Team</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: 'Your Lost Item Has Been Found! 🎉',
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${ownerEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendItemFoundNotification
};
