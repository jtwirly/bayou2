import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const SimpleChart = () => {
  // Hardcoded data for testing
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sample Data',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default SimpleChart;
