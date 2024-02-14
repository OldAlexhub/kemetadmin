import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignedReturns = () => {
  const [trips, setTrips] = useState([]);
  const [isUnassignSuccess, setIsUnassignSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_POST_RETURN_ASSIGNED,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrips(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleUnassign = async (trip) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_DELETE_RETURN_ASSIGNED}/${trip._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201 || response.status === 204) {
        setIsUnassignSuccess(true);
        setTrips((prevAssigns) =>
          prevAssigns.filter((a) => a._id !== trip._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Booking ID,Driver ID,Pickup Address,Pickup Date,Pickup Time,Drop Off Address,Name\n";
    trips.forEach((trip) => {
      const row = `${trip.bookingId},${trip.driverId},${
        trip.returnCity
      },${new Date(trip.returnDate).toLocaleDateString()},${trip.returnTime},${
        trip.returnDropOffCity
      },${trip.name}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "assigned_trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h3>Return Trips</h3>
      </div>
      <div>
        <button className="btn btn-primary mb-3" onClick={downloadCsv}>
          Download CSV
        </button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Booking ID</th>
              <th>Driver ID</th>
              <th>Pickup Address</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Drop Off Address</th>
              <th>Name</th>
              <th>Unassign</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.bookingId}</td>
                <td>{trip.driverId}</td>
                <td>{trip.returnCity}</td>
                <td>{new Date(trip.returnDate).toLocaleDateString()}</td>
                <td>{trip.returnTime}</td>
                <td>{trip.returnDropOffCity}</td>
                <td>{trip.name}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleUnassign(trip)}
                  >
                    Unassign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isUnassignSuccess && (
          <div className="alert alert-success" role="alert">
            Trip Unassigned Successfully...
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedReturns;
