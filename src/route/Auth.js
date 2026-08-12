import { Router } from 'express';
import { register , login, passwordResset, passwordResetPost } from '../controllers/Auth.js';
import { requireAuth } from '../middleware/auth.js';
import {getMyStores} from '../controllers/Store.js'

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/stores', requireAuth, getMyStores);
router.post('/passwordResset', passwordResset);
router.post('/passwordResetPost', passwordResetPost);

export default router;