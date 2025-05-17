import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';

// import { registerSchema } from '../../schemas/registerSchema';
// import { validateBody } from '../../middleware/validate';

const router = Router();
const customerController = new CustomerController();


router.post('/',  (req, res, next) => customerController.create(req, res, next));
router.get('/', (req, res, next) => customerController.getAll(req, res, next));




export default router;
