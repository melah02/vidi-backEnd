import type { Request, Response } from "express";
import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import { createReservedAccount } from "../services/monify.ts";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createWallet = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { bvn } = req.body;

    if (!bvn) {
      return res.status(400).json({
        message: "BVN is required",
      });
    }

    if (!/^\d{11}$/.test(bvn)) {
      return res.status(400).json({
        message: "BVN must be 11 digits",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent creating multiple wallets
    const existingWallet = await Wallet.findOne({
      where: {
        user_id: userId,
      },
    });

    if (existingWallet) {
      return res.status(409).json({
        message: "Wallet already exists",
        wallet: existingWallet,
      });
    }

    const accountReference = `VIDI-${user.id}`;

    const monnifyResponse = await createReservedAccount({
      accountReference,
      accountName: user.full_name,
      customerEmail: user.email,
      customerName: user.full_name,
      bvn,
    });

    if (!monnifyResponse.requestSuccessful) {
      return res.status(400).json({
        message:
          monnifyResponse.responseMessage ||
          "Unable to create wallet",
      });
    }

    const reservedAccount =
      monnifyResponse.responseBody;

    const account =
      reservedAccount.accounts?.[0];

    if (!account) {
      return res.status(500).json({
        message:
          "Monnify created the reservation but no account was returned",
      });
    }

    const wallet = await Wallet.create({
      user_id: userId,

      provider: "MONNIFY",

      provider_customer_reference:
        reservedAccount.accountReference,

      account_number: account.accountNumber,

      account_name: account.accountName,

      bank_name: account.bankName,

      balance: "0.00",

      status: "ACTIVE",

      is_verified: true,
    });

    return res.status(201).json({
      message: "Wallet created successfully",

      wallet: {
        id: wallet.id,
        account_number: wallet.account_number,
        account_name: wallet.account_name,
        bank_name: wallet.bank_name,
        balance: wallet.balance,
        status: wallet.status,
      },
    });
  } catch (error: any) {
    console.error(
      "Create wallet error:",
      error.response?.data || error
    );

    return res.status(500).json({
      message: "Failed to create wallet",
      error:
        error.response?.data?.responseMessage ||
        error.message,
    });
  }
};