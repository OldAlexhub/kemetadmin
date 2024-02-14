import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const PayOut = () => {
  const [driverPayments, setDriverPayments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPays();
  }, []);

  const fetchPays = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(process.env.REACT_APP_SHOW_SENT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const aggregatedPayments = response.data.show.reduce((acc, pay) => {
        if (!acc[pay.driverId]) {
          acc[pay.driverId] = {
            driverId: pay.driverId,
            totalFare: 0,
            payments: [],
          };
        }
        acc[pay.driverId].totalFare += pay.fare;
        acc[pay.driverId].payments.push(pay);
        return acc;
      }, {});

      setDriverPayments(Object.values(aggregatedPayments));
    } catch (error) {
      console.error(error);
      setError("Failed to fetch payments.");
    }
  };

  const payout = async (driverId, totalFare) => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      // Attempt to perform the payout operation
      const payoutResponse = await axios.post(
        process.env.REACT_APP_PAY_OUT,
        { driverId, totalFare },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (payoutResponse.status === 201) {
        // If payout is successful, attempt to delete the payment record
        const deleteUrl = `${process.env.REACT_APP_DELETE_PAYMENT}/${driverId}`;
        await axios.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update UI to reflect the deletion without needing to refetch from server
        const updatedPayments = driverPayments.filter(
          (payment) => payment.driverId !== driverId
        );
        setDriverPayments(updatedPayments);
        setSuccess(`Payout and deletion successful for Driver ID: ${driverId}`);
      }
    } catch (error) {
      console.error(error);
      setError("Operation failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" className="img-fluid mb-3" />
        <h2>Driver Payments</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {driverPayments.map((driverPayment) => (
        <div key={driverPayment.driverId} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Driver ID: {driverPayment.driverId}</h5>
            <p className="card-text">
              Total Fare: ${driverPayment.totalFare.toFixed(2)}
            </p>
            <button
              className="btn btn-primary"
              onClick={() =>
                payout(driverPayment.driverId, driverPayment.totalFare)
              }
            >
              Payout
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayOut;
