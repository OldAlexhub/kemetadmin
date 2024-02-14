import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels); // Register the datalabels plugin

const DriversGraph = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDrivers(response.data.driver);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDrivers();
  }, []);

  // Prepare the data for the chart
  const chartData = {
    labels: ["Drivers"],
    datasets: [
      {
        label: "Number of Drivers",
        data: [drivers.length], // Assuming drivers is an array of driver objects
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart, including datalabels configuration and hiding the legend
  const chartOptions = {
    plugins: {
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "top",
        formatter: (value, context) => {
          return value; // Display the actual value
        },
      },
      legend: {
        display: false, // Add this line to hide the legend
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
      {drivers.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Loading drivers count...</p>
      )}
    </div>
  );
};

export default DriversGraph;
