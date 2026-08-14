import { Router } from 'express';
import {requireRole} from '../middleware/requireRole.js';

import { getAllUsers } from '../controllers/admin.js';

const router = Router();

router.get('/getAllUsers', requireRole('admin'), getAllUsers);

export default router;