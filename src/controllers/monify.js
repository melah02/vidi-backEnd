import { createReservedAccount } from "../services/monify.ts";
import Wallet from "../models/Wallet.js";

export async function createReservedAccountController(req, res) {
  const user = req.user;
  try {
    const accountDetails = await createReservedAccount({
      accountReference: `VIDI-VIDI-VIDI-${user.id}`,
      accountName: req.body.accountName,
      customerEmail: req.body.email,
      customerName: req.body.customerName,
      bvn: req.body.bvn,
    });

    if (accountDetails.requestSuccessful === false) {
      return res.status(400).json({
        message: "Failed to create reserved account",
        details: accountDetails,
      });
    }

    console.log(accountDetails);

    const reservedAccount = accountDetails.responseBody;
    //    requestSuccessful: true,
    // responseMessage: 'success',
    // responseCode: '0',
    // responseBody: {
    //   contractCode: '5867418298',
    //   accountReference: 'VIDI-66742a6e-4ea5-435c-9d5b-845b78b02976',
    //   accountName: 'Mel',
    //   currencyCode: 'NGN',
    //   customerEmail: 'melxymelah02@gmail.com',
    //   customerName: 'melah elkanah',
    //   accountNumber: '1004094983',
    //   bankName: 'Wema bank',
    //   bankCode: '035',
    //   collectionChannel: 'RESERVED_ACCOUNT',
    //   reservationReference: 'XSNBKXHM8L82PCCW7UZZ',
    //   reservedAccountType: 'INVOICE',
    //   status: 'INACTIVE',
    //   createdOn: '2026-10-05 16:21:40.933973069',
    //   incomeSplitConfig: [],
    //   bvn: '22345432433',
    //   nin: '11212121212',
    //   restrictPaymentSource: false,
    //   metaData: {}

    const existingWallet = await Wallet.findOne({
          where: {
            user_id: user.id,
          },
        });

        if(existingWallet){
          return res.status(409).json({
            message: "wallet already Exist",
            wallet: existingWallet
          })

        }

    const wallet = await Wallet.create({
      user_id: user.id,

      provider: "MONNIFY",

      provider_customer_reference: reservedAccount.accountReference,

      account_number: reservedAccount.accountNumber,

      account_name: reservedAccount.accountName,

      bank_name: reservedAccount.bankName,

      balance: "0.00",

      status: "ACTIVE",

      is_verified: true,
    });
    if (wallet) {
      console.log("Wallet created successfully:", wallet);
    }
    res.status(201).json({
      message: "Reserved account created successfully",
      wallet,
    });
  
  } catch (error) {
    console.error("Error creating reserved account:", error);
    res.status(500).json({
      message: "Error creating reserved account",
    });
  }
}
