// index.js
import Head from 'next/head';
import { useState } from 'react';
import EnergyChart from './components/EnergyChart'; // Ensure this path is correct
import GasChart from './components/GasChart'; // Ensure this path is correct
import SimpleChart from './components/SimpleChart';

function Home() {
  const [utilityData, setUtilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerID, setCustomerID] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/fetchEnergyData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ customerID })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch energy data');
      }

      const apiResponse = await res.json();
      console.log("API Data:", apiResponse);
      setUtilityData(apiResponse);

    } catch (error) {
      console.error("Error during form submission:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>Energy Usage Dashboard</title>
        <meta name="description" content="Dashboard for visualizing and optimizing energy usage" />
      </Head>
      <div className="flex pt-40 p-4 flex-col max-w-lg w-full h-screen gap-6">
        <h1 className="text-4xl font-bold text-center">Energy Usage Dashboard</h1>
        <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-5">
          <input
            type="text"
            name="customerID"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            className="border-2 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Customer ID"
          />
          <input
            className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700"
            type="submit"
            value="Get Energy Data"
          />
        </form>
        {loading && <div>Loading...</div>}
        {utilityData && (
          <div>
            <EnergyChart utilityData={utilityData} />
            <GasChart utilityData={utilityData} />
            <SimpleChart />
          </div>
        )}
        {!loading && !utilityData && <p>No data to display</p>}
      </div>
    </div>
  );
}

export default Home;
