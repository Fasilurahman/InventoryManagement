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

const corsOptions: cors.CorsOptions = {
  origin: [
    'https://inventory-management-five-ruby.vercel.app',
    'https://inventory-management-git-main-fasilurahmans-projects.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
};


app.use(cors(corsOptions));
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
