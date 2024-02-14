import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");

        const drivers = await axios.get(process.env.REACT_APP_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDrivers(drivers.data.driver);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDrivers();
  }, []);
  return (
    <div className="container mt-3">
      <div className="text-center">
        <img
          src={Logo}
          alt="logo"
          className="mb-3"
          style={{ maxWidth: "350px" }}
        />
      </div>
      <h2 className="text-center">Drivers List</h2>
      <table className="table table-responsive table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>DriverId</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Vehicle Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.driverId}</td>
              <td>{driver.fname}</td>
              <td>{driver.lname}</td>
              <td>{driver.email}</td>
              <td>{driver.make}</td>
              <td>{driver.model}</td>
              <td>{driver.year}</td>
              <td>{driver.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Drivers;
