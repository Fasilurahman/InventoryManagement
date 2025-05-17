import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
// import { registerSchema } from '../../schemas/registerSchema';
// import { validateBody } from '../../middleware/validate';

const router = Router();
const authController = new AuthController();


router.post('/register',  (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));


router.use((req, res, next) => {
    console.log(`Request received at ${req.originalUrl}`);
    next();
});

export default router;
