const bcrypt = require('bcrypt');

const hashed = '$2b$10$8zddh2CSpcNTc42.dZACweffrOQkm3sSKfRUXwjWo6O2fge3hgMvq';
const password = 'string';

bcrypt.compare(password, hashed).then(console.log); 