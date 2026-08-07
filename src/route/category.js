import { Router } from 'express'
import { getAllCategories, createCategory } from '../controllers/Category.js'
import {requireAuth} from '../middleware/auth.js'

const router = Router();

router.get('/', requireAuth, getAllCategories)
router.post('/', requireAuth, createCategory) // TODO: lock this down to admin-only once an admin role exists

export default router;