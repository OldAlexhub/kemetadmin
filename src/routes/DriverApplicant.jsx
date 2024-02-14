import React, { useState, useEffect } from "react";
import axios from "axios";

const DriverApplicant = () => {
  const [applicants, setApplicants] = useState([]);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);
  const [isDenySuccess, setIsDenySuccess] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_APPLICANTS_DRIVERS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicants(response.data.applicants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplicants();
  }, []);

  const handleApprove = async (app) => {
    // Added parameter to specify which applicant to approve
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_ADD_DRIVER,
        {
          fname: app.fname,
          lname: app.lname,
          email: app.email,
          make: app.make,
          model: app.model,
          year: app.year,
          phoneNumber: app.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      if (response.status === 201) {
        setIsApprovedSuccess(true);
        await axios.delete(
          `${process.env.REACT_APP_DELETE_APPLICANT}/${app._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeny = async (app) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_DELETE_APPLICANT}/${app._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsDenySuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>DL Number</th>
              <th>DL Expiration Date</th>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Plate Numbers</th>
              <th>Approve</th>
              <th>Deny</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app._id}>
                <td>{app.fname}</td>
                <td>{app.lname}</td>
                <td>{app.phoneNumber}</td>
                <td>{app.email}</td>
                <td>{app.driverLicneseNumber}</td>
                <td>
                  {new Date(app.driverLicenseExpiry).toLocaleDateString()}
                </td>
                <td>{app.make}</td>
                <td>{app.model}</td>
                <td>{app.year}</td>
                <td>{app.plateNumber}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(app)}
                  >
                    Approve
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeny(app)}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isApprovedSuccess && (
        <div className="alert alert-success" role="alert">
          Driver Approved ...
        </div>
      )}
      {isDenySuccess && (
        <div className="alert alert-danger" role="alert">
          Driver Denied ...
        </div>
      )}
    </div>
  );
};

export default DriverApplicant;
