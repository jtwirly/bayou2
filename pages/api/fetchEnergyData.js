// pages/api/fetchEnergyData.js
import axios from 'axios'; // Using axios for HTTP requests

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Fetch utility data using Bayou API
      const utilityData = await fetchUtilityDataFromBayou(email, password);
      res.status(200).json({ utilityData });
    } catch (error) {
      console.error("Error fetching data from Bayou:", error.message);
      res.status(500).json({ error: "Error fetching data" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const fetchUtilityDataFromBayou = async (email, password) => {
  // Use Axios to make API calls to Bayou with provided credentials
  const bayouApiKey = process.env.BAYOU_API_KEY;
  const authHeaders = {
    'Authorization': `Basic ${Buffer.from(`${bayouApiKey}:`).toString('base64')}`
  };

  // Fetch data from Bayou API
  const response = await axios.post(`https://bayou.energy/api/v2/data`, { email, password }, { headers: authHeaders });
  return response.data;
};
