// src/components/Footer.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center pb-5">
      {/* Fixed footer at bottom */}
      <footer className="position-fixed bottom-0 start-0 end-0 text-center text-muted py-2">
        <div className="container">
          <p className=" mb-0">
            &copy; 2025 Official Website - Advait Teleservices Private Limited. All rights reserved.



          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
