import { getUserProfile } from "../controllers/profile.js";
import {requireAuth} from "../middleware/auth.js"
import {Router} from 'express';

const router = Router();

router.get('/personal_profile',requireAuth,getUserProfile);


export default router;