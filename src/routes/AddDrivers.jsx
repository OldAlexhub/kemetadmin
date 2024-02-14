import React, { useState } from "react";
import Logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDrivers = () => {
  const [isDriverIn, setIsDriverIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    make: "",
    model: "",
    year: "",
    phoneNumber: "",
  });
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_ADD_DRIVER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setIsDriverIn(true);
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
                style={{ maxWidth: "170px" }}
              />
            </div>

            <div className="mb-3">
              <h3 style={{ textAlign: "center" }}>Add Driver</h3>
              <input
                type="text"
                placeholder="First Name"
                value={formData.fname}
                name="fname"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lname}
                name="lname"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Vehicle Make"
                value={formData.make}
                name="make"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Vehicle Model"
                value={formData.model}
                name="model"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Vehicle Year"
                value={formData.year}
                name="year"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Add Driver
            </button>
            {isDriverIn && (
              <div className="alert alert-success mt-3" role="alert">
                Driver Added... Redirecting to Home!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDrivers;
