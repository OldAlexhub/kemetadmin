import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const ShowPayments = () => {
  const [driverPayments, setDriverPayments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_FINALS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedTrips = response.data.show.sort((a, b) => {
          return (
            new Date(a.datePaid) - new Date(b.datePaid) ||
            a.driverId.localeCompare(b.driverId)
          );
        });

        // Grouping trips by driverId
        const groupedTrips = sortedTrips.reduce((acc, trip) => {
          if (!acc[trip.driverId]) {
            acc[trip.driverId] = [];
          }
          acc[trip.driverId].push(trip);
          return acc;
        }, {});

        setDriverPayments(groupedTrips);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const csvHeaders = "Date Paid,Driver ID,Income\n";
    const csvRows = Object.keys(driverPayments)
      .map((driverId) =>
        driverPayments[driverId]
          .map(
            (trip) =>
              `${new Date(trip.datePaid).toLocaleDateString()},${
                trip.driverId
              },${trip.totalFare.toFixed(2)}`
          )
          .join("\n")
      )
      .join("\n");

    const csvString = `${csvHeaders}${csvRows}`;
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" className="img-fluid mb-3" />
        <h2>Driver Payments</h2>
        <button className="btn btn-success mt-3" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
      {Object.keys(driverPayments).map((driverId) => (
        <div key={driverId}>
          <h3>Driver ID: {driverId}</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date Paid</th>
                <th>Income</th>
              </tr>
            </thead>
            <tbody>
              {driverPayments[driverId].map((trip, index) => (
                <tr key={index}>
                  <td>{new Date(trip.datePaid).toLocaleDateString()}</td>
                  <td>${trip.totalFare.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ShowPayments;
