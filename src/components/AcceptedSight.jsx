import React, { useEffect, useState } from "react";
import axios from "axios";

const AcceptedSight = () => {
  const [assigns, setAssigns] = useState([]);
  const [isUnassignSuccess, setIsUnassignSuccess] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_SHOW_ASSIGNED_SIGHT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssigns(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrips();
  }, []);

  const downloadCSV = () => {
    const csvRows = [
      // CSV Header
      "Booking Id,Driver Id,Pickup Address,Pickup Date,Pickup Time,Drop Off Address,Name,Phone Number",
      // Data
      ...assigns.map((assign) =>
        [
          assign.bookingId,
          assign.driverId,
          `"${assign.pickupAddress}"`, // Wrap in quotes to handle commas
          new Date(assign.pickupDate).toLocaleDateString(),
          assign.pickupTime,
          `"${assign.destination}"`, // Wrap in quotes to handle commas
          assign.name,
          assign.phoneNumber,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "assigned-trips.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUnassign = async (assign) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Assign object:", assign);
      // console.log("Assign ID:", assign._id);
      const url = `${process.env.REACT_APP_UNASSIGN_SIGHT}/${assign._id}`;
      // console.log(url); // This will now correctly log the URL with the trip's _id

      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setIsUnassignSuccess(true);
        // Optionally, refresh the list of assignments or remove the unassigned trip from state
        setAssigns((prevAssigns) =>
          prevAssigns.filter((a) => a._id !== assign._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="table-responsive">
        <div className="text-center mb-4">
          <h3>Sightseeing</h3>
        </div>
        {/* Make table responsive */}
        <button className="btn btn-primary mb-2" onClick={downloadCSV}>
          Download CSV
        </button>{" "}
        {/* Download CSV button */}
        <table className="table">
          {" "}
          {/* Apply Bootstrap table styles */}
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>Driver Id</th>
              <th>Pickup Address</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Drop Off Address</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Unassign</th>
            </tr>
          </thead>
          <tbody>
            {assigns.map((assign) => (
              <tr key={assign._id}>
                <td>{assign.bookingId}</td>
                <td>{assign.driverId}</td>
                <td>{assign.pickupAddress}</td>
                <td>{new Date(assign.date).toLocaleDateString()}</td>
                <td>{assign.time}</td>
                <td>{assign.to}</td>
                <td>{assign.name}</td>
                <td>{assign.phoneNumber}</td>
                <td>
                  <button
                    onClick={() => handleUnassign(assign)}
                    className="btn btn-warning"
                  >
                    Unassign
                  </button>

                  {/* Bootstrap button styles */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isUnassignSuccess && (
          <div className="alert alert-success" role="alert">
            Trip Unassiged Successfully...
          </div>
        )}
      </div>
      ;
    </div>
  );
};

export default AcceptedSight;
