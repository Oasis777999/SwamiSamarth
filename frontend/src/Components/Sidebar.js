import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // sidebar visibility for mobile

  const isLogin = localStorage.getItem("token");

  const LogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button (only on mobile) */}
      {isLogin && (
        <button
          className="btn btn-light rounded-circle shadow d-md-none position-fixed top-0 end-0 m-3"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          style={{
            width: "44px",
            height: "44px",
            zIndex: 1055, // or higher as needed
          }}
        >
          <i className="bi bi-list-task fs-4 text-dark"></i>
        </button>
      )}

      {/* Sidebar */}
      {isLogin && (
        <div
          className={`bg-darkBlue text-white vh-100 shadow-lg position-fixed top-0 start-0 p-3 flex-column flex-shrink-0 ${
            isOpen ? "d-flex" : "d-none"
          } d-md-flex`}
          style={{ width: "250px", zIndex: 1050 }}
        >
          <div>
            <img
              src={logo}
              alt="Logo"
              height="100"
              width="100"
              className="img-fluid"
            />
          </div>
          <ul className="nav nav-pills flex-column mb-auto gap-2">
            <li className="nav-item">
              <Link
                to="/add-agent"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-person-plus-fill"></i> Add Agent
              </Link>
            </li>
            <li>
              <Link
                to="/data"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-table"></i>Volontiers List
              </Link>
            </li>
            <li>
              <Link
                to="/agent-data"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-table"></i>Agent List
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-graph-up"></i> Reports
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-person-circle"></i> Profile
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="nav-link text-white d-flex align-items-center gap-2"
                onClick={() => {
                  setIsOpen(false);
                  LogOut();
                }}
              >
                <i className="bi bi-box-arrow-right"></i> Log Out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
