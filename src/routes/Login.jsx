import React, { useState } from "react";
import Logo from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_LOGIN_ADMIN,
        formData
      );
      const { token, userId, name, role } = response.data;
      if (response.status === 200) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);
        setIsLoggedIn(true); // Set success state to true
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="login-page"
      style={{
        backgroundImage:
          "url('https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/egypt-tours-and-trips.jpg')",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-light rounded shadow"
            >
              <h1 className="h3 mb-3 font-weight-normal text-center">
                Welcome To Kemet Transportation
              </h1>
              <h2 className="h5 mb-3 font-weight-normal text-center">
                Transportation Management Software
              </h2>
              <div className="text-center mb-4">
                <img
                  src={Logo}
                  alt="logo"
                  className="mb-4"
                  style={{ maxWidth: "170px" }}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
              {isLoggedIn && (
                <div className="alert alert-success mt-3" role="alert">
                  Login Successful... Redirecting to Home!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
