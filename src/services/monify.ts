import axios from "axios";

const MONNIFY_BASE_URL = "https://api.monnify.com/api/v1";

export const getMonnifyToken = async () => {
  try {
    
     const credentials = `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`;

  const encodedCredentials = Buffer
    .from(credentials)
    .toString("base64");

  const response = await axios.post(
    `${MONNIFY_BASE_URL}/auth/login`,
    {},
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.responseBody.accessToken;

  } catch (error) {
    console.log("Error getting Monnify token:", error);
  }
 
};


export const createReservedAccount = async ({
  accountReference,
  accountName,
  customerEmail,
  customerName,
  bvn,
}: {
  accountReference: string;
  accountName: string;
  customerEmail: string;
  customerName: string;
  bvn: string;
}) => {
try {
  const token = await getMonnifyToken();

  const response = await axios.post(
    `${MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`,
    {
      accountReference,
      accountName,
      currencyCode: "NGN",
      contractCode: process.env.MONNIFY_CONTRACT_CODE,
      customerEmail,
      customerName,
      bvn,
      getAllAvailableBanks: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
} catch (error) {
  console.log("Error creating reserved account:", error);
}
};