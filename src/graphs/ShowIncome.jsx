import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const ShowDriverIncomeGraph = () => {
  const [driverPayments, setDriverPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_FINALS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assuming response.data.show is an array of payment objects
        setDriverPayments(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Assuming each payment object has a 'date' and 'amount' field
  const paymentData = driverPayments.map((payment) => payment.totalFare);
  const paymentLabels = driverPayments.map((payment) =>
    new Date(payment.datePaid).toLocaleDateString()
  );

  const totalPayouts = driverPayments.reduce(
    (total, payment) => total + payment.totalFare,
    0
  );

  const data = {
    labels: paymentLabels,
    datasets: [
      {
        label: "Driver Income",
        data: paymentData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "700px", height: "500px" }}>
      <h3>Total Payouts: ${totalPayouts.toFixed(2)}</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default ShowDriverIncomeGraph;
