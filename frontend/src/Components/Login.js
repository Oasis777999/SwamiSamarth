import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/Logo.png";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    let result = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify({ mobile, password }),
      headers: {
        "content-type": "application/json",
      },
    });

    result = await result.json();
    console.log(result);
    if (!result.error) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      navigate("/data");
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="card shadow border-0 p-4 p-md-5 bg-lightBlue"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="text-center mb-4 bg-lightBlue">
          <img
            src={logo}
            alt="Logo"
            height="100"
            width="100"
            className="img-fluid bg-lightBlue"
          />
          <h3 className="fw-bold text-danger mt-2 bg-lightBlue">Welcome Back</h3>
          <p className="text-muted small bg-lightBlue">Login to your account</p>
        </div>

        <div className="mb-3 bg-white">
          <label className="form-label fw-semibold bg-white">
            Mobile Number
          </label>
          <input
            type="tel"
            className="form-control form-control-lg"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9999999999"
            maxLength={10}
            required
          />
        </div>

        <div className="mb-4 bg-white">
          <label className="form-label fw-semibold bg-white">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="d-grid mb-3 bg-white">
          <button className="btn btn-warning btn-lg" onClick={handleLogin}>
            Sign In
          </button>
        </div>

        <div className="text-center bg-white">
          <small className="text-muted bg-white">
            Trouble logging in? <br />
            <span className="fw-semibold text-primary bg-white">
              Contact support: 9999999999
            </span>
          </small>
        </div>

        <div className="text-center mt-3 bg-white">
          <small className="text-muted bg-white">
            Don't have an account?{" "}
            <a href="#" className="text-decoration-none bg-white">
              Sign Up
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
