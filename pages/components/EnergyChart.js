import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EnergyChart = ({ utilityData }) => {
  if (!utilityData || !utilityData.meters) {
    return <p>No data available</p>;
  }
  // Prepare chart labels and data
  const labels = [];
  const dataPoints = [];

  utilityData.meters.forEach(meter => {
    console.log(`Meter: ${meter.id}, Intervals:`, meter.intervals.slice(0, 10));
  });   

  // Chart data structure for Chart.js
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Net Electricity Consumption',
        data: dataPoints,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default EnergyChart;
