import { Router } from "express";
import { createWallet } from "../controllers/wallet.ts";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/create",
  requireAuth,
  createWallet
);

export default router;