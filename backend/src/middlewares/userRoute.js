const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

// ✅ Routes for ADMIN ONLY
router.get('/admin/dashboard', authenticate, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});
// ✅ Routes for ADMIN ONLY
router.get('/contacts', authenticate, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard' });
  });

// ✅ Routes for ADMIN or USER
router.get('/userdash', authenticate, authorizeRole('admin', 'user'), (req, res) => {
  res.json({ message: `Hello ${req.user.role}: Welcome to User Dashboard` });
});

// ✅ Route for USER ONLY
router.get('/user/profile', authenticate, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Welcome to your profile' });
});

module.exports = router;
