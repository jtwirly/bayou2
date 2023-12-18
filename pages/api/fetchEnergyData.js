// pages/api/fetchEnergyData.js
import axios from 'axios'; // Using axios for HTTP requests

// Define bayouDomain and bayouApiKey at the top of your file
const bayouDomain = "staging.bayou.energy";
const bayouApiKey = process.env.BAYOU_API_KEY; // Make sure this is set in your environment variables
const authHeaders = { 
    'Authorization': `Basic ${Buffer.from(`${bayouApiKey}:`).toString('base64')}`,
    'Content-Type': 'application/json'
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customerID } = req.body;
    //const { email, password } = req.body;

    try {
      // Fetch utility data using Bayou API
      const intervalData = await fetchIntervalDataFromBayou(customerID);
      console.log("Interval Data:", intervalData)
      //const utilityData = await fetchUtilityDataFromBayou(email, password);
      res.status(200).json({ utilityData: intervalData });
      //res.status(200).json({ utilityData });
    } catch (error) {
      console.error("Error fetching data from Bayou:", error.message);
      res.status(500).json({ error: "Error fetching data" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const fetchIntervalDataFromBayou = async (customerID) => {
    // Get the current date and the date one month ago
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // Format dates in YYYY-MM-DD format
    const endDate = currentDate.toISOString().split('T')[0];
    const startDate = oneMonthAgo.toISOString().split('T')[0];

    // Construct the URL with query parameters for date range
    const url = `https://${bayouDomain}/api/v2/customers/${customerID}/intervals?start=${startDate}&end=${endDate}`;

    const response = await axios.get(url, { headers: authHeaders });
    return response.data;
};

// Fetch a specific page of interval data
//const fetchIntervalDataFromBayou = async (customerID, page = 1, pageSize = 10) => {
    //const response = await axios.get(`https://${bayouDomain}/api/v2/customers/${customerID}/intervals?page=${page}&pageSize=${pageSize}`, { headers: authHeaders });
    //return response.data;
//};

//Fetch all the data
//const fetchIntervalDataFromBayou = async (customerID) => {
    //const response = await axios.get(`https://${bayouDomain}/api/v2/customers/${customerID}/intervals`, { headers: authHeaders });
    //return response.data;
  //};

//const fetchUtilityDataFromBayou = async (email, password) => {
  // Use Axios to make API calls to Bayou with provided credentials
  //const bayouApiKey = process.env.BAYOU_API_KEY;
  //const authHeaders = {
    //'Authorization': `Basic ${Buffer.from(`${bayouApiKey}:`).toString('base64')}`
  //};

  // Fetch data from Bayou API
  //const response = await axios.post(`https://bayou.energy/api/v2/data`, { email, password }, { headers: authHeaders });
  //return response.data;
//};
