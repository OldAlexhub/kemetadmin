import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register the datalabels plugin if you're using it
Chart.register(ChartDataLabels);

const BookingsGraphs = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const TripData = await axios.get(process.env.REACT_APP_TRIP_REQUESTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips(TripData.data.trips);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrips();
  }, []);

  // Assuming each trip has a bookingId and you want to count them
  const bookingCount = trips.length; // Each trip represents a booking

  // Chart data setup
  const chartData = {
    labels: ["Bookings"],
    datasets: [
      {
        label: "Number of Bookings",
        data: [bookingCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
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

export default BookingsGraphs;
