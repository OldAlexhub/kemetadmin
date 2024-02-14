import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png"; // Ensure path is correct

const SightseeingRequests = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [isAssignSuccess, setIsAssignSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const driverData = await axios.get(process.env.REACT_APP_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tripsData = await axios.get(
          process.env.REACT_APP_SIGHT_SEEING_REQUESTS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrips(tripsData.data.show);
        setDrivers(driverData.data.driver);
      } catch (error) {
        console.error(error); // Changed to console.error for better error handling
      }
    };
    fetchData();
  }, []);

  const handleDriverSelectionChange = (tripId, driverId) => {
    setSelectedDrivers((prevSelectedDrivers) => ({
      ...prevSelectedDrivers,
      [tripId]: driverId,
    }));
  };

  const AssignDriver = async (tripId) => {
    try {
      const token = localStorage.getItem("token");
      const driverMongoId = selectedDrivers[tripId];
      const driver = drivers.find((d) => d._id === driverMongoId);
      const actualDriverId = driver ? driver.driverId : null;

      const trip = trips.find((t) => t._id === tripId);
      if (!trip || !actualDriverId) return; // Ensure trip and driver are selected

      const response = await axios.post(
        process.env.REACT_APP_ASSIGN_SIGHT,
        {
          bookingId: trip.bookingId,
          name: trip.name,
          pickupAddress: trip.pickupAddress,
          date: trip.date,
          time: trip.time,
          duration: trip.duration,
          dropoffAddress: trip.dropoffAddress,
          email: trip.email,
          phoneNumber: trip.phoneNumber,
          fare: trip.fare,
          special: trip.special,
          driverId: actualDriverId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setIsAssignSuccess(true); // Set success state to true
      }
    } catch (error) {
      console.error(error);
    }
  };
  const downloadCSV = () => {
    const filename = "sightseeing-requests.csv";
    const csvRows = [
      // Column headers
      [
        "Booking ID",
        "Customer Name",
        "Pickup Address",
        "Pickup Date",
        "Pickup Time",
        "Dropoff Address",
        "Duration",
        "Email",
        "Phone Number",
        "Special Requests",
        "Fare",
        "Assigned Driver ID",
      ].join(","),
      // Data rows
      ...trips.map((trip) =>
        [
          trip.bookingId,
          trip.name,
          trip.pickupAddress,
          trip.date,
          trip.time,
          trip.dropoffAddress,
          trip.duration,
          trip.email,
          trip.phoneNumber,
          trip.special,
          trip.fare,
          selectedDrivers[trip._id]
            ? drivers.find((driver) => driver._id === selectedDrivers[trip._id])
                .driverId
            : "Not Assigned",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <img
          src={Logo}
          alt="logo"
          className="img-fluid"
          style={{ maxWidth: "150px" }}
        />
      </div>
      {isAssignSuccess && (
        <div className="alert alert-success" role="alert">
          Trip Assigned Successfully!
        </div>
      )}
      <button className="btn btn-info" onClick={downloadCSV}>
        Download CSV
      </button>

      <div className="table-responsive">
        <table className="table">
          <thead className="table-light">
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Pickup Address</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Dropoff Address</th>
              <th>Duration</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Special Requests</th>
              <th>Fare</th>
              <th>Drivers</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.bookingId}</td>
                <td>{trip.name}</td>
                <td>{trip.pickupAddress}</td>
                <td>{new Date(trip.date).toLocaleDateString()}</td>
                <td>{trip.time}</td>
                <td>{trip.dropoffAddress}</td>
                <td>{trip.duration}</td>
                <td>{trip.email}</td>
                <td>{trip.phoneNumber}</td>
                <td>{trip.special}</td>
                <td>${trip.fare}</td>
                <td>
                  <select
                    className="form-select"
                    value={selectedDrivers[trip._id] || ""}
                    onChange={(e) =>
                      handleDriverSelectionChange(trip._id, e.target.value)
                    }
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.driverId}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => AssignDriver(trip._id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SightseeingRequests;
