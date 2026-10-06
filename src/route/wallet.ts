import { Router } from "express";
import {  getWallet } from "../controllers/wallet.ts";
import { requireAuth } from "../middleware/auth.js";

const router = Router();


router.get(
  "/getWallet",
  requireAuth,
  getWallet
);

export default router;