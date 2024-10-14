import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import reimbursementRoutes from './routes/reimbursement';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// 使用路由
app.use('/api/reimbursements', reimbursementRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Full-Stack App API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});