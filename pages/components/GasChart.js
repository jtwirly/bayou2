import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const GasChart = ({ utilityData }) => {
  if (!utilityData || !utilityData.meters || utilityData.meters.length === 0) {
    return <p>No gas consumption data available.</p>;
  }

  const labels = [];
  const dataPoints = [];

  utilityData.meters.forEach(meter => {
    console.log(`Meter: ${meter.id}, Intervals:`, meter.intervals.slice(0, 10));
  });  

  // Check if we have any data points
  if (dataPoints.length === 0) {
    return <p>No gas consumption data available.</p>;
  }

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Gas Consumption',
      data: dataPoints,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return <Bar data={chartData} options={options} />;
};

export default GasChart;
