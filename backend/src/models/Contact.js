const mongoose = require('mongoose'); 

// File: models/Contact.js
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

module.exports = mongoose.model('Contact', ContactSchema);