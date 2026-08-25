import {Router} from 'express';
import { createOrder } from '../controllers/Order.js';
import { requireAuth } from "../middleware/auth.js";


const router = Router();

router.post('/order', requireAuth, createOrder);

export default router;