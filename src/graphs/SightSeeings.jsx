import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register the datalabels plugin if you're using it
Chart.register(ChartDataLabels);

const SightSeeingsGraphs = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const tripsData = await axios.get(
          process.env.REACT_APP_SIGHT_SEEING_REQUESTS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrips(tripsData.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Count of sightseeing trips
  const tripsCount = trips.length;

  // Chart data setup
  const chartData = {
    labels: ["Sightseeing Trips"],
    datasets: [
      {
        label: "Number of Trips",
        data: [tripsCount],
        backgroundColor: ["rgba(153, 102, 255, 0.2)"],
        borderColor: ["rgba(153, 102, 255, 1)"],
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

export default SightSeeingsGraphs;
