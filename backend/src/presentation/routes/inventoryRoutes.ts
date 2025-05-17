import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

// import { registerSchema } from '../../schemas/registerSchema';
// import { validateBody } from '../../middleware/validate';

const router = Router();
const inventoryController = new InventoryController();


router.post('/',  (req, res, next) => inventoryController.create(req, res, next));
router.get('/',   (req, res, next)=> inventoryController.getAll(req, res, next));
router.put('/:itemId', (req, res, next) => inventoryController.update(req, res, next));
router.delete('/:id', (req, res, next)=> inventoryController.delete(req, res, next));


export default router;
