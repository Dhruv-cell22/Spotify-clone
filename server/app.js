const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const songRouter = require('./routes/songRoutes');
const userRouter = require('./routes/userRoutes');
const playlistRouter = require('./routes/playlistRoutes');
const searchRouter = require('./routes/searchRoutes');

const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development URL
  'https://spotify-clone-iiyy.vercel.app', // Deployed frontend URL on Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use('/public', express.static('public'));

// Define the root route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Dhruv’s Spotify Clone API');
});

// Define other routes
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/search', searchRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
