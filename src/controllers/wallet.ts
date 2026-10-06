import type { Request, Response } from "express";
import Wallet from "../models/Wallet.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userWallet = await Wallet.findOne({
      where: { user_id: userId },
    });

    if(!userWallet){
      return res.status(500).json({
        message: "Unable to find existing wallet",
        userWallet: null
      })
    }

    return res.status(200).json({
      message: "fetched wallet succesfully",
      userWallet: userWallet
    })

  } catch (error) {
    console.log(error)

  }
};
