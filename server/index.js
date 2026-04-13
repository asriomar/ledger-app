// 1. Import tools
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');

// 2. Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware (Middleman for data)
app.use(express.json()); // Allows us to receive JSON data from the frontend
app.use(cors());         // Allows cross-origin requests
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

// 4. Basic Route (To test if the server works)
app.get('/', (req, res) => {
    res.send('Ledger Server is Running!');
});

// 5. Connect to MongoDB and Start Server
// We use 'mongodb://127.0.0.1:27017/ledgerDB' for local development
// mongoose.connect('mongodb://127.0.0.1:27017/ledgerDB')
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log('❌ DB Connection Error:', err));