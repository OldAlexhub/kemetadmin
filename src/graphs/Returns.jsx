import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register the datalabels plugin if you're using it
Chart.register(ChartDataLabels);

const ReturnsGraphs = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const fetchReturns = async () => {
      // Mark function as async
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_SHOW_RETURN_TRIPS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReturns(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReturns();
  }, []);

  // Count of return trips
  const returnsCount = returns.length;

  // Chart data setup
  const chartData = {
    labels: ["Return Trips"],
    datasets: [
      {
        label: "Number of Returns",
        data: [returnsCount],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "top",
        formatter: (value) => value,
      },
      legend: {
        display: false, // Hides the legend
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "600px", height: "500px" }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ReturnsGraphs;
