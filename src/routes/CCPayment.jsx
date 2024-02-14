import React, { useState } from "react";
import Logo from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CCPayment = () => {
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    userId: user,
    name: "",
    email: "",
    ccNumber: "",
    csv: "",
    expirationDate: "",
    zipCode: "",
  });
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_SUBMIT_PAYMENT,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setIsPaymentSuccess(true); // Set success state to true
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <h1>Credit Card Information</h1>
            <div className="text-center mb-4">
              <img
                src={Logo}
                alt="logo"
                className="img-fluid mb-3"
                style={{ maxWidth: "350px" }}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Credit Card Number"
                name="ccNumber"
                value={formData.ccNumber}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="CSV Number"
                name="csv"
                value={formData.csv}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="expirationDate" className="form-label">
                Expiration Date
              </label>
              <input
                type="date"
                className="form-control"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                placeholder="Expiration Date"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            {isPaymentSuccess && (
              <div className="alert alert-success" role="alert">
                Payment Submitted... Redirecting to Home!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CCPayment;
