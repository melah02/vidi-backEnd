import {
  testMonnifyConnection,
  createReservedAccount,
} from "../services/monify.ts";

export async function testMonnify(req, res) {
  try {
    const token = await getMonnifyToken();
    const user = req.user;
    const bvn = req.body.bvn;
    const accountname = req.body.accountName;
    const response = await axios.post(
      "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts",
      {
        accountReference: `VIDI-${user.id}`,
        accountName: accountName,
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        customerEmail: user.email,
        customerName: user.name,
        bvn: bvn,
        getAllAvailableBanks: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Monnify response:", response.data);
    res.status(200).json({
      connected: true,
      message: "Monnify connection successful",
      data: response.data,
    });
  } catch (error) {
    console.error("Monnify connection error:", error);

    res.status(500).json({
      connected: false,
      message: error.message,
    });
  }
}

export async function createReservedAccountController(req, res) {
  const user = req.user;
  createReservedAccount(
    `VIDI-${user.id}`,
    req.body.accountName,
    user.email,
    user.name,
    req.body.bvn,
  );
}
