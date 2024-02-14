import React, { useEffect, useState } from "react";
import axios from "axios";

const ReturnTrips = () => {
  const [returns, setReturns] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [isAssignSuccess, setIsAssignSuccess] = useState(false);

  const handleDriverSelectionChange = (tripId, driverId) => {
    setSelectedDrivers((prevSelectedDrivers) => ({
      ...prevSelectedDrivers,
      [tripId]: driverId,
    }));
  };

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const token = localStorage.getItem("token");
        const DriverData = await axios.get(process.env.REACT_APP_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await axios.get(
          process.env.REACT_APP_SHOW_RETURN_TRIPS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReturns(response.data.show);
        setDrivers(DriverData.data.driver);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReturns();
  }, []);

  const handleAssign = async (ret) => {
    const driverMongoId = selectedDrivers[ret._id];
    const selectedDriver = drivers.find((d) => d._id === driverMongoId);
    const actualDriverId = selectedDriver ? selectedDriver.driverId : null;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_POST_RETURN_TRIP,
        {
          bookingId: ret.bookingId,
          driverId: actualDriverId,
          name: ret.name,
          returnCity: ret.returnCity,
          returnPickupAddress: ret.returnPickupAddress,
          returnDate: ret.returnDate,
          returnTime: ret.returnTime,
          returndropOffCity: ret.returndropOffCity,
          returnDropoff: ret.returnDropoff,
          fare: ret.fare * 0.4,
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

  // Function to convert data to CSV
  const convertToCSV = (data) => {
    const headers =
      "BookingId,Name,Return From,Return Address,Return Date,Return Time,Dropoff At,Drop off Location,Fare\n";
    const rows = data
      .map(
        (ret) =>
          `${ret.bookingId},${ret.name},${ret.returnCity},${
            ret.returnPickupAddress
          },${new Date(ret.returnDate).toLocaleDateString()},${
            ret.returnTime
          },${ret.returndropOffCity},${ret.returnDropoff},${ret.fare}`
      )
      .join("\n");

    return headers + rows;
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(returns);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "return-trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h2>Return Trips</h2>
      <button className="btn btn-primary mb-2" onClick={downloadCSV}>
        Download as CSV
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>BookingId</th>
            <th>Name</th>
            <th>Return From</th>
            <th>Return Address</th>
            <th>Return Date</th>
            <th>Return Time</th>
            <th>Dropoff At</th>
            <th>Drop off Location</th>
            <th>Fare</th>
            <th>Drivers</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret) => (
            <tr key={ret._id}>
              <td>{ret.bookingId}</td>
              <td>{ret.name}</td>
              <td>{ret.returnCity}</td>
              <td>{ret.returnPickupAddress}</td>
              <td>{new Date(ret.returnDate).toLocaleDateString()}</td>
              <td>{ret.returnTime}</td>
              <td>{ret.returndropOffCity}</td>
              <td>{ret.returnDropoff}</td>
              <td>${ret.fare}</td>
              <td>
                <select
                  className="form-select"
                  onChange={(e) =>
                    handleDriverSelectionChange(ret._id, e.target.value)
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
                  onClick={() => handleAssign(ret)}
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
  );
};

export default ReturnTrips;
