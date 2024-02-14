import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/logo.png"; // Ensure path is correct
import ReturnTrips from "../components/ReturnTrips";

const TripRequests = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [isAssignSuccess, setIsAssignSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const DriverData = await axios.get(process.env.REACT_APP_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const TripData = await axios.get(process.env.REACT_APP_TRIP_REQUESTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips(TripData.data.trips);
        setDrivers(DriverData.data.driver);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const csvRows = [
      // Headers
      [
        "BookingId",
        "Name",
        "Pickup From",
        "Pickup Date",
        "Pickup Time",
        "Passangers Count",
        "Destination",
        "Dropoff Address",
        "Phone Number",
        "Email",
        "Fare",
        "Driver",
      ],
      // Data
      ...trips.map((trip) =>
        [
          trip.bookingId,
          trip.name,
          trip.pickupAddress,
          trip.pickupDate,
          trip.pickupTime,
          trip.passCount,
          trip.destination,
          trip.dropoffAddress,
          trip.phoneNumber,
          trip.email,
          trip.fare,
          "Driver Placeholder",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "trip-requests.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleDriverSelectionChange = (tripId, driverId) => {
    setSelectedDrivers((prevSelectedDrivers) => ({
      ...prevSelectedDrivers,
      [tripId]: driverId,
    }));
  };

  const handleSubmit = async (trip) => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("userId");
      const driverMongoId = selectedDrivers[trip._id];
      const driver = drivers.find((d) => d._id === driverMongoId);
      const actualDriverId = driver ? driver.driverId : null;

      const response = await axios.post(
        process.env.REACT_APP_POST_ASSIGN,
        {
          userId: user,
          name: trip.name,
          driverId: actualDriverId,
          bookingId: trip.bookingId,
          pickupAddress: trip.pickupAddress,
          pickupDate: trip.pickupDate,
          pickupTime: trip.pickupTime,
          passCount: trip.passCount,
          destination: trip.destination,
          dropoffAddress: trip.dropoffAddress,
          phoneNumber: trip.phoneNumber,
          fare: trip.fare,
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
      console.log(error);
    }
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
      <div className="text-end mb-3">
        <button className="btn btn-primary" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead className="table-light">
            <tr>
              <th>BookingId</th>
              <th>Name</th>
              <th>Pickup From</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Passangers Count</th>
              <th>Destination</th>
              <th>Dropoff Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Fare</th>
              <th>Driver</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.bookingId}</td>
                <td>{trip.name}</td>
                <td>{trip.pickupAddress}</td>
                <td>{new Date(trip.pickupDate).toLocaleDateString()}</td>
                <td>{trip.pickupTime}</td>
                <td>{trip.passCount}</td>
                <td>{trip.destination}</td>
                <td>{trip.dropoffAddress}</td>
                <td>{trip.phoneNumber}</td>
                <td>{trip.email}</td>
                <td>${trip.fare}</td>
                <td>
                  <select
                    className="form-select"
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
                    className="btn btn-success"
                    onClick={() =>
                      handleSubmit(trip, selectedDrivers[trip._id])
                    }
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isAssignSuccess && (
          <div className="alert alert-success" role="alert">
            Trip Assigned...
          </div>
        )}
      </div>
      <ReturnTrips />
    </div>
  );
};

export default TripRequests;
