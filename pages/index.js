// index.js
import Head from 'next/head';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Home() {
  // State initialization
  const [bayouCredentials, setBayouCredentials] = useState({ email: '', password: '' });
  const [utilityData, setUtilityData] = useState(null);
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleCredentialsChange = (e) => {
    setBayouCredentials({ ...bayouCredentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetching energy data
      const res = await fetch('/api/fetchEnergyData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bayouCredentials)
      });

      if (!res.ok) {
        throw new Error('Failed to fetch energy data');
      }

      const data = await res.json();
      setUtilityData(data.utilityData);

      // Fetching tips
      const tipsRes = await fetch('/api/generateTips', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ utilityData: data.utilityData })
      });

      if (!tipsRes.ok) {
        throw new Error('Failed to fetch tips');
      }

      const tipsData = await tipsRes.json();
      setTips(tipsData.tips);

    } catch (error) {
      console.error("Error during form submission:", error.message);
      // Handle the error appropriately in your UI
    } finally {
      setLoading(false);
    }
  };

  // UtilityDataChart Component
const UtilityDataChart = ({ utilityData }) => {
  // Assuming utilityData is an array of objects with 'date' and 'usage' properties
  const data = {
    labels: utilityData.map(item => item.date),
    datasets: [
      {
        label: 'Energy Usage',
        data: utilityData.map(item => item.usage),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar data={data} />;
};

  // UI Rendering
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
            type="email"
            name="email"
            value={bayouCredentials.email}
            onChange={handleCredentialsChange}
            className="border-2 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Bayou Email"
          />
          <input
            type="password"
            name="password"
            value={bayouCredentials.password}
            onChange={handleCredentialsChange}
            className="border-2 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Bayou Password"
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
            <h2>Utility Data Visualization:</h2>
            <UtilityDataChart utilityData={utilityData} />
          </div>
        )}
        {tips && (
          <div>
            <h2>Energy Efficiency Tips:</h2>
            <p>{tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
