const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../.env');

// Function to generate JWT secret
function generateJWTSecret() {
    return crypto.randomBytes(32).toString('hex');
}

// Function to update only the JWT_SECRET in the .env file
function updateEnvJWTSecret(newSecret) {
    let envContent = '';

    // Read existing .env content if file exists
    if (fs.existsSync(envFilePath)) {
        const lines = fs.readFileSync(envFilePath, 'utf-8').split('\n');
        const updatedLines = lines.map(line => {
            if (line.startsWith('JWT_SECRET=')) {
                return `JWT_SECRET=${newSecret}`;
            }
            return line;
        });

        // If JWT_SECRET was not found, add it
        if (!updatedLines.some(line => line.startsWith('JWT_SECRET='))) {
            updatedLines.push(`JWT_SECRET=${newSecret}`);
        }

        envContent = updatedLines.join('\n');
    } else {
        // File doesn't exist, create with JWT_SECRET only
        envContent = `JWT_SECRET=${newSecret}`;
    }

    fs.writeFileSync(envFilePath, envContent, 'utf-8');
}

// Countdown Timer for 1 hour (3600 seconds)
let countdown = 3600;

const timerInterval = setInterval(() => {
    countdown--;

    if (countdown < 0) {
        clearInterval(timerInterval);
        const newSecret = generateJWTSecret();
        console.log('Updated JWT_SECRET:', newSecret);
        updateEnvJWTSecret(newSecret);
    }
}, 1000);

// Generate an initial JWT Secret and save it
const initialSecret = generateJWTSecret();
updateEnvJWTSecret(initialSecret);
