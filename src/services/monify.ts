import axios from "axios";

export const getMonnifyToken = async () => {
  try {

  //   const authToken = Buffer.from(`${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`).toString('base64');
    
    
  //   console.log("Auth Token: .......=======>>>>>>>>>>", authToken); 
  // const response = await axios.post(
  //   `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
  //   {},
  //   {
  //     headers: {
  //       Authorization: `Basic ${authToken}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );


const options = {
  method: 'POST',
  url: 'https://sandbox.monnify.com/api/v1/auth/login',
  headers: {
    Authorization: 'Basic TUtfVEVTVF9HQzNCOFhHMlhYOkE2NjNOUlpBNTQ0RERQRU03S0RON1o4SFJWNllYRDhT'
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data.responseBody.accessToken)
  return data.responseBody.accessToken
} catch (error) {
  console.error(error)
}


  // console.log("Monnify Token Response: .......=======>>>>>>>>>>", response.data);
  // return response;

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

  console.log(`monnifyToken: ${token}`);


const options = {
  method: 'POST',
  url: 'https://sandbox.monnify.com/api/v1/bank-transfer/reserved-accounts',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data: {
    contractCode: '5867418298',
    accountName: accountName,
    currencyCode: 'NGN',
    accountReference: accountReference,
    customerEmail: customerEmail,
    customerName: customerName,
    getAllAvailableBanks: true,
    bvn: bvn,
    nin: '11212121212',
    reservedAccountType: 'INVOICE'
  }

}

try {
  const { data } = await axios.request(options)
  console.log(data)

  return data
} catch (error) {
  console.error(error)
}
} catch (error) {
  console.log("Error creating reserved account:", error);
}
};