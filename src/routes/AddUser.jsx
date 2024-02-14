import React, { useState } from "react";
import Logo from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [isUserIn, setUserIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_ADD_USER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setUserIn(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
            <div className="text-center mb-4">
              <img
                src={Logo}
                alt="logo"
                className="mb-3"
                style={{ maxWidth: "150px" }}
              />
              <h4>Add Admins</h4>
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="First Name"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Last Name"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Add Admin
            </button>
            {isUserIn && (
              <div className="alert alert-success mt-3" role="alert">
                Admin Added... Redirecting to Home!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
