import { Router } from 'express';
import { addToCart, getCart } from '../controllers/Cart.ts';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/addToCart', requireAuth, addToCart);
router.get('/getCart', requireAuth, getCart);

export default router;