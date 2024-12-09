// src/components/LoginForm/LoginForm.js
import React, { useState } from 'react';
import "./LoginForm.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginUser } from '../../api/api'; 
import { useNavigate } from "react-router-dom";
import logo from '../../image/logo.jpg'
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      setMessage("Login successful!");
      localStorage.setItem("token", response.token); // Save JWT token
      navigate("/Dashboard"); // Navigate to AdminDashboard
    } catch (err) {
      setMessage(err.error || "Login failed");
    }
  };

  return (
    <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
      <div className="card card0 border-0">
        <div className="row d-flex">
          <div className="col-lg-6">
            <div className="card1 pb-5">
              <div className="row">
                <img src={logo} alt="Logo" className="logo" />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card2 card border-0 px-4 py-5">
              <form onSubmit={handleLogin}>
                <div className="row px-3">
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Email Address</h6>
                  </label>
                  <input
                    className="mb-4"
                    type="email"
                    placeholder="Enter a valid email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="row px-3">
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Password</h6>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="row px-3 mb-4">
                  <a href="#" className="ml-auto mb-0 text-sm">Forgot Password?</a>
                </div>
                <div className="row mb-3 px-3">
                  <button type="submit" className="btn btn-blue text-center">Login</button>
                </div>
                {message && <div className="text-danger mt-3">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
