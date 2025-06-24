// File: index.js
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoute');
const lostItemRoutes = require('./routes/lostItemRoute');
const foundItemRoutes = require('./routes/foundItemRoute');
const userRoutes = require('./routes/userRoute');
const connectDB = require('./config/db');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const contactRoutes = require('./routes/contactRoute');
const emailRoutes = require('./routes/emailRoute');
const app = express();

// Initialize database connection
const initializeApp = async () => {
    try {
        await connectDB();
        
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Enable CORS for all routes
        app.use(cors({
            origin: process.env.NODE_ENV === 'production' ? false : '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        app.use(bodyParser.json());

        // Routes
        app.use('/users', userRoutes);
        app.use('/auth', authRoutes);
        app.use('/lostItems', lostItemRoutes);
        app.use('/foundItems', foundItemRoutes);
        app.use('/contacts', contactRoutes);
        app.use('/notify-owner', emailRoutes);

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // Serve static files from the frontend build directory in production
        if (process.env.NODE_ENV === 'production') {
            app.use(express.static(path.join(__dirname, '../../frontend/dist')));
            
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
            });
        } else {
            app.get('/', (req, res) => {
                res.json({ message: "Hello from backend" });
            });
        }

        // Error-handling middleware
        app.use((err, req, res, next) => {
            console.error('❌ Error caught:', err.message);
            console.error(err.stack);
            
            // Handle specific error types
            if (err.name === 'MongoError' || err.name === 'MongoServerError') {
                return res.status(503).json({ 
                    error: 'Database error',
                    message: 'Unable to process request due to database issues'
                });
            }
            
            res.status(500).json({ 
                error: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
};

initializeApp();
