import React, { useEffect, useState } from "react";
import axios from "axios";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_SHOW_COMPANIES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, []);
  return (
    <div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Company Name</th>
              <th>Fleet Size</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>{company.phoneNumber}</td>
                <td>{company.companyName}</td>
                <td>{company.fleetSize}</td>
                <td>{company.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;
