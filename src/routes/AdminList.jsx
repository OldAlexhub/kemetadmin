import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const AdminList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async (e) => {
      try {
        const token = localStorage.getItem("token");
        const admins = await axios.get(process.env.REACT_APP_ADMINS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(admins.data.admins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
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
      <h2>Admins List</h2>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminList;
