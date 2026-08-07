import { Router } from 'express';
import { getMyStores, createStore } from '../controllers/Store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/stores', requireAuth, getMyStores);
router.post('/createStore', requireAuth, createStore);

export default router;