import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="container py-5">
      <div className="card p-4 col-md-6 col-lg-6 mx-auto shadow-lg border-0">
        <div className="text-center mb-4">
          <i
            className="bi bi-person-circle"
            style={{ fontSize: "3rem", color: "#0d6efd" }}
          ></i>
          <h2 className="mt-2 text-primary">Login</h2>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Mobile Number</label>
          <input
            type="tel"
            className="form-control form-control-lg"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            maxLength={10}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            Login
          </button>
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            Not able to login contact @9999999999
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
