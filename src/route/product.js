import { Router } from 'express'
import { getAllProducts, getStoreProducts, addProductToStore } from '../controllers/Product.js'
import {requireAuth} from '../middleware/auth.js'

const router = Router()

router.post('/allproducts', requireAuth, getAllProducts)
router.post('/addProductToStore', requireAuth, addProductToStore)
router.get('/', requireAuth, getStoreProducts)

export default router