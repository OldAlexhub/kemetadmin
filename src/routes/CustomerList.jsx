import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_CUSTOMER_LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img
          src={Logo}
          alt="logo"
          className="mb-3"
          style={{ maxWidth: "350px" }}
        />
        <h3>Customer List</h3>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  {customer.fname} {customer.lname}
                </td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
