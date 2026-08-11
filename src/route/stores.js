import { Router } from 'express';
import { getMyStores, createStore } from '../controllers/Store.js';
import { requireAuth } from '../middleware/auth.js';
import { getAllProducts } from '../controllers/Product.js';

const router = Router();

router.get('/stores', requireAuth, getMyStores);
router.post('/createStore', requireAuth, createStore);
router.post('/all', getAllProducts);

export default router;