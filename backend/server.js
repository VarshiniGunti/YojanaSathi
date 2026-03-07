import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import schemesRoutes from './routes/schemes.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/schemes', schemesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'YojanaSathi API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      healthDetailed: '/api/v1/health/detailed',
      searchSchemes: '/api/v1/schemes/search',
      analyzeProfile: '/api/v1/schemes/analyze-profile',
      getScheme: '/api/v1/schemes/:id'
    }
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info('Server running on port ' + PORT);
  console.log('🚀 YojanaSathi backend server running on port ' + PORT);
  console.log('📍 Health check: http://localhost:' + PORT + '/api/v1/health');
});

export default app;
