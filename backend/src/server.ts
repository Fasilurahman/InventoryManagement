import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './presentation/routes/authRoutes';
import customerRoutes from './presentation/routes/customerRoutes';
import inventoryRoutes from './presentation/routes/inventoryRoutes';
import reportRoutes from './presentation/routes/reportRoutes';
import  {errorHandler}  from './infrastructure/middlewares/errorHandler';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: [
    'https://inventory-management-five-ruby.vercel.app', // Add your new frontend URL
    'https://task-management-six-lilac.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Request received at ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes); 
app.use('/api/inventory', inventoryRoutes);
app.use('/api', reportRoutes);
app.use(errorHandler);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
