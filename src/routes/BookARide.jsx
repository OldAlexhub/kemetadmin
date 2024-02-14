import React, { useState, useEffect } from "react";
import Logo from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookARide = () => {
  const navigate = useNavigate();
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const user = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    userId: user,
    name: "",
    airlines: "",
    flightNumber: "",
    arrivalDate: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    passCount: "",
    destination: "",
    dropoffAddress: "",
    phoneNumber: "",
    email: "",
    fare: "",
  });

  useEffect(() => {
    // Function to calculate fare
    const calculateFare = () => {
      const { pickupAddress, destination } = formData;

      // Cairo to/from Alexandria
      if (
        ((pickupAddress === "cairo" || pickupAddress === "cai") &&
          (destination === "alexandria" || destination === "hbe")) ||
        ((pickupAddress === "alexandria" || pickupAddress === "hbe") &&
          (destination === "cairo" || destination === "cai"))
      ) {
        return "75";
      }

      // Alexandria to/from Alexandria Airport
      else if (
        (pickupAddress === "alexandria" && destination === "hbe") ||
        (pickupAddress === "hbe" && destination === "alexandria")
      ) {
        return "45";
      }

      // Cairo to/from Cairo Airport
      else if (
        (pickupAddress === "cairo" && destination === "cai") ||
        (pickupAddress === "cai" && destination === "cairo")
      ) {
        return "45";
      }

      return "0"; // Default fare or another calculation
    };

    // Update fare in formData
    setFormData({ ...formData, fare: calculateFare() });
  }, [formData.pickupAddress, formData.destination]);

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_POST_BOOKING,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setIsBookingSuccess(true); // Set success state to true
        setTimeout(() => {
          navigate("/ccpayment");
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
            <div className="text-center mb-4">
              <img
                src={Logo}
                alt="logo"
                className="img-fluid mb-3"
                style={{ maxWidth: "350px" }}
              />
            </div>
            <h1 style={{ textAlign: "center" }}>Book A Ride</h1>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone Number"
                onChange={handleChange}
                name="phoneNumber"
                value={formData.phoneNumber}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Customer Name"
                onChange={handleChange}
                name="name"
                value={formData.name}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                name="email"
                value={formData.email}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Airlines"
                onChange={handleChange}
                name="airlines"
                value={formData.airlines}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Flight Number"
                onChange={handleChange}
                name="flightNumber"
                value={formData.flightNumber}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="arrivalDate" className="form-label">
                Arrival Date
              </label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                className="form-control"
                onChange={handleChange}
                value={formData.arrivalDate}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="pickupFrom" className="form-label">
                Pickup From
              </label>
              <select
                className="form-select"
                id="pickupFrom"
                name="pickupAddress"
                onChange={handleChange}
                value={formData.pickupAddress}
              >
                <option value="">Select One</option>
                <option value="cai">Cairo International Airport- CAI</option>
                <option value="hbe">
                  Alexandria International Airport- HBE
                </option>
                <option value="cairo">Cairo City</option>
                <option value="alexandria">Alexandria City</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="pickupDate" className="form-label">
                Pickup Date
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                className="form-control"
                onChange={handleChange}
                value={formData.pickupDate}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="pickupTime" className="form-label">
                Pickup Time
              </label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                className="form-control"
                onChange={handleChange}
                value={formData.pickupTime}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="destination" className="form-label">
                Destination
              </label>
              <select
                className="form-select"
                id="destination"
                name="destination"
                onChange={handleChange}
                value={formData.destination}
              >
                <option value="">Select One</option>
                <option value="cai">Cairo International Airport- CAI</option>
                <option value="hbe">
                  Alexandria International Airport- HBE
                </option>
                <option value="cairo">Cairo City</option>
                <option value="alexandria">Alexandria City</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="destination" className="form-label">
                Passanger Count
              </label>
              <select
                className="form-select"
                id="passCount"
                name="passCount"
                onChange={handleChange}
                value={formData.passCount}
              >
                <option value="">Select One</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Dropoff Address/ Location"
                onChange={handleChange}
                name="dropoffAddress"
                value={formData.dropoffAddress}
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                name="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
              />
            </div>
            <div className="mb-3">
              <label>Fare: ${formData.fare}</label>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Book A Ride
              </button>
            </div>
            {isBookingSuccess && (
              <div className="alert alert-success" role="alert">
                Booking in Progress... Redirecting to Payment!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookARide;
