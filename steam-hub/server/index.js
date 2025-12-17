require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/app', require('./routes/appRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/health', (req, res) => {
  res.send('OK');
})

// Serve Static Payload (for now)
// app.use(express.static(path.join(__dirname, 'public')));
// Be more specific to allow accessing generated payloads
app.use('/payloads', express.static(path.join(__dirname, 'public/payloads')));

// Basic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
// Trigger restart
// Trigger restart
