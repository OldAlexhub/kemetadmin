import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const Completed = () => {
  const [trips, setTrips] = useState([]);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_COMPLETED_TRIPS,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const tripsWithData = response.data.completed.map((trip) => ({
          ...trip,
          paymentSent: false, // Flag to track payment status
        }));
        setTrips(tripsWithData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSend = async (tripId, e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setErrorMessage(""); // Reset error message
    setIsPaymentSuccess(false); // Reset payment success status
    try {
      const trip = trips.find((t) => t._id === tripId);
      const response = await axios.post(
        process.env.REACT_APP_SEND_TO_PAYMENT,
        {
          tripId,
          driverId: trip.driverId,
          fare: trip.fare,
          bookingId: trip.bookingId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setTrips(
          trips.map((t) => (t._id === tripId ? { ...t, paymentSent: true } : t))
        );
        setIsPaymentSuccess(true); // Assume success indicates payment sent
      }
    } catch (error) {
      // console.error(error);
      if (error.response && error.response.status === 400) {
        // Handle specific 400 status code
        setErrorMessage("Payment was already added for this booking.");
      } else {
        // General error handling
        setErrorMessage("An error occurred while processing the payment.");
      }
    }
  };

  const downloadCSV = () => {
    const csvRows = [
      [
        "Date Completed",
        "Booking ID",
        "Driver ID",
        "Customer Name",
        "Trip Date",
        "From",
        "To",
        "Fare",
      ],
    ];
    trips.forEach((trip) => {
      csvRows.push([
        new Date(trip.dateComplete).toLocaleDateString(),
        trip.bookingId,
        trip.driverId,
        trip.name,
        new Date(trip.tripDate).toLocaleDateString(),
        trip.from,
        trip.to,
        trip.fare,
      ]);
    });

    const csvString = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "completed_trips.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" className="img-fluid mb-3" />
        <h2>Completed Trips</h2>
      </div>
      <button className="btn btn-info mb-3" onClick={downloadCSV}>
        Download CSV
      </button>
      {isPaymentSuccess && (
        <div className="alert alert-success" role="alert">
          Payment sent successfully.
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Date Completed</th>
                  <th>Booking ID</th>
                  <th>Driver ID</th>
                  <th>Customer Name</th>
                  <th>Trip Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Fare</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id}>
                    <td>{new Date(trip.dateComplete).toLocaleDateString()}</td>
                    <td>{trip.bookingId}</td>
                    <td>{trip.driverId}</td>
                    <td>{trip.name}</td>
                    <td>{new Date(trip.tripDate).toLocaleDateString()}</td>
                    <td>{trip.from}</td>
                    <td>{trip.to}</td>
                    <td>${trip.fare}</td>
                    <td>
                      <button
                        className={`btn ${
                          trip.paymentSent ? "btn-success" : "btn-primary"
                        }`}
                        disabled={trip.paymentSent}
                        onClick={(e) => handleSend(trip._id, e)}
                      >
                        {trip.paymentSent ? "Sent" : "Send Payment"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {errorMessage && (
              <div className="alert alert-warning" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completed;
