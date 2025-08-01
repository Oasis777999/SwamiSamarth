import React, { useState } from "react";
import stateData from "../State.json";
import logo from "../Images/Logo.png";
import api from "../apis/api";
import { useEffect } from "react";

export const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    photo: "",
    kycDocument: "",
    password: "",
  });

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
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 200 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than or equal to 200 KB.");
      setPhoto(null);
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error : ", error);
    };
  }

  function converToBase64kycDocument(e) {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 200 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than or equal to 200 KB.");
      setkycDocument(null);
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setkycDocument(reader.result);
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
      submissionData.append("gender", formData.gender);
      submissionData.append("dob", formData.dob);
      submissionData.append("mobile", formData.mobile);
      submissionData.append("address", formData.address);
      submissionData.append("district", selectedDistrict);
      submissionData.append("state", selectedState);
      submissionData.append("pincode", formData.pincode);
      submissionData.append("photo", photo);
      submissionData.append("kycDocument", kycDocument);
      submissionData.append("password", formData.password);

      // 🔍 Validate that no value is empty/null/undefined
      for (let [key, value] of submissionData.entries()) {
        if (!value || value=="null") {
          alert(`Please fill in the field "${key}" `);
          return; // Stop submission
        }
      }

      const response = await api.post("/register", submissionData);

      if (response) {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  useEffect(() => {}, []);
  return (
    <div className="container py-5">
      <div className="row  justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow p-4">
            <div className="container my-4">
              <div className="d-flex  bg-lightBlue flex-column flex-sm-row align-items-center gap-3 p-3 border rounded shadow-sme">
                <div className="flex-shrink-0 ">
                  <img
                    src={logo}
                    alt="Logo"
                    height="100"
                    width="100"
                    className="img-fluid bg-lightBlue"
                  />
                </div>
                <div className="bg-lightBlue">
                  <h3 className=" text-warning fw-bold text-danger bg-lightBlue">
                    Dindoripranit
                  </h3>
                  <p className=" text-muted bg-lightBlue">
                    Shree Swami Samarth Seva Marg
                  </p>
                  <h4 className="mb-0 text-secondary fst-italic fs-6 bg-lightBlue">
                    Akhil Bhartiya Shree Swami Samarth Gurupeeth
                  </h4>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white">
              {/* Full Name */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split("T")[0]} // prevents future dates
                />
              </div>

              {/* Gender */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
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
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Mobile <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="mobile"
                  pattern="\d{10}"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>

              {/* State */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
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

              {/* District */}
              {selectedState && (
                <div className="mb-4 bg-white">
                  <label className="form-label bg-white">
                    District <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                  >
                    <option value="">Select District</option>
                    {stateData[selectedState].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pincode */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Pincode <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  pattern="^[1-9][0-9]{5}$"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                  title="Enter a valid 6-digit pincode"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Photo <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  accept="image/*"
                  onChange={converToBase64Photo}
                  required
                />

                {photo ? (
                  <img
                    src={photo}
                    alt="profile"
                    className="mt-2 rounded shadow-sm bg-white"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <p class="text-danger small fst-italic mt-2 text-start bg-white">
                    Image size limit: 200KB
                  </p>
                )}
              </div>

              {/* KYC Document */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Upload Aadhaar <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="kycDocument"
                  accept="image/*"
                  onChange={converToBase64kycDocument}
                  required
                />

                {kycDocument ? (
                  <img
                    src={kycDocument}
                    alt="KYC"
                    className="mt-2 rounded shadow-sm bg-white"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <p class="text-danger small fst-italic mt-2 text-start bg-white">
                    Image size limit: 200KB
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4 bg-white">
                <label className="form-label bg-white">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
