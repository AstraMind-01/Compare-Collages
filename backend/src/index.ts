import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';
import savedRoutes from './routes/savedRoutes';
import questionRoutes from './routes/questionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/saved-colleges', savedRoutes);
app.use('/api/questions', questionRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
