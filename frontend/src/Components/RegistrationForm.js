import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import stateData from "../State.json";
import logo from "../Images/Logo.png";

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    mobile: "",
    gender: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    photo: "",
    kycDocument: "",
  });

  const navigate = useNavigate();

  const [photo, setPhoto] = useState("");
  const [kycDocument, setkycDocument] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function converToBase64Photo(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPhoto(reader.result);
      console.log(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error : ", error);
    };
  }

  function converToBase64kycDocument(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setkycDocument(reader.result);
      console.log(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error : ", error);
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submissionData = new FormData();

      // Append all form fields
      submissionData.append("name", formData.name);
      submissionData.append("dob", formData.dob);
      submissionData.append("gender", formData.gender);
      submissionData.append("mobile", formData.mobile);
      submissionData.append("address", formData.address);
      submissionData.append("district", selectedDistrict);
      submissionData.append("state", selectedState);
      submissionData.append("pincode", formData.pincode);
      submissionData.append("photo", photo);
      submissionData.append("kycDocument", kycDocument);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: submissionData,
      });

      navigate("/thankyou");

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      alert("Form submitted successfully");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container py-5 fs-5">
      <div className="card bg-lightBlue p-4 shadow col-lg-8 mx-auto">
        <div className="my-4">
          <div className="d-flex bg-lightBlue  flex-column flex-sm-row align-items-center gap-3 p-3 border rounded shadow-sme">
            <div className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                height="100"
                width="100"
                className="img-fluid"
              />
            </div>
            <div>
              <h3 className="mb-1 text-warning fw-bold">Dindoripranit</h3>
              <p className="mb-1 text-muted">Shree Swami Samarth Seva Marg</p>
              <h4 className="mb-0 text-secondary fst-italic fs-6">
                Akhil Bhartiya Shree Swami Samarth Gurupeeth
              </h4>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* DOB */}
          <div className="mb-4">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="form-label">
              Gender <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="form-label">
              Mobile <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              maxLength={10}
              inputMode="numeric"
              pattern="\d{10}"
              required
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* State & District */}
          <div className="mb-4">
            <label className="form-label">
              State <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("");
              }}
              required
            >
              <option value="">Select State</option>
              {Object.keys(stateData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">
              District <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
            >
              <option value="">Select District</option>
              {selectedState &&
                stateData[selectedState]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Pincode & Address */}
          <div className=" mb-4">
            <label className="form-label">
              Pincode <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="pincode"
              pattern="^[1-9][0-9]{5}$"
              inputMode="numeric"
              maxLength={6}
              required
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Photo */}
          <div className="mb-4">
            <label className="form-label">
              Upload Photo <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={converToBase64Photo}
              required
            />
            {photo && (
              <img
                src={photo}
                alt="preview"
                className="mt-2 rounded shadow-sm"
                height={100}
                width={100}
              />
            )}
          </div>

          {/* Aadhaar */}
          <div className="mb-4">
            <label className="form-label">
              Upload Aadhaar <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={converToBase64kycDocument}
              required
            />
            {kycDocument && (
              <img
                src={kycDocument}
                alt="preview"
                className="mt-2 rounded shadow-sm"
                height={100}
                width={100}
              />
            )}
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
