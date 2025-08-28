import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import stateData from "../State.json";
import logo from "../Images/Logo.png";
import api from "../apis/api";

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

  console.log(formData.dob);

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
      submissionData.append("dob", formData.dob);
      submissionData.append("gender", formData.gender);
      submissionData.append("mobile", formData.mobile);
      submissionData.append("address", formData.address);
      submissionData.append("district", selectedDistrict);
      submissionData.append("state", selectedState);
      submissionData.append("pincode", formData.pincode);
      submissionData.append("photo", photo);
      submissionData.append("kycDocument", kycDocument);

      for (let [key, value] of submissionData.entries()) {
        if (!value || value == "null") {
          alert(`Please fill in the field "${key}" `);
          return; // Stop submission
        }
      }

      const response = await api.post("/upload", submissionData);

      navigate("/thankyou");
      alert("Form submitted successfully");
      let TQMessage =
        await fetch(`http://sms.advaitdigital.com/api/smsapi?key=c0a386bcdce63e8ce841f9e127b2458b&route=1&sender=COOCSL&number=${formData.mobile}&sms=Dear, Rs. 10000 has been debited to your account 66. Account balance: Rs. 00. Chartered Co-Operative
      &templateid=1707173614237110753`);
    } catch (error) {
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
                className="img-fluid bg-lightBlue"
              />
            </div>
            <div className="bg-lightBlue">
              <h3 className="mb-1 text-danger fw-bold bg-lightBlue">
                Dindoripranit
              </h3>
              <p className="mb-1 text-muted bg-lightBlue">
                Shree Swami Samarth Seva Marg
              </p>
              <h4 className="mb-0 text-secondary fst-italic fs-6 bg-lightBlue">
                Akhil Bhartiya Shree Swami Samarth Gurupeeth
              </h4>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className=" bg-white">
          {/* Name */}
          <div className="mb-4 bg-white">
            <label className="form-label bg-white">
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
          <div className="mb-4 bg-white">
            <label className="form-label bg-white">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
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
              maxLength={10}
              inputMode="numeric"
              pattern="\d{10}"
              required
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* State & District */}
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
              {selectedState &&
                stateData[selectedState]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Pincode & Address */}
          <div className=" mb-4 bg-white">
            <label className="form-label bg-white">
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

          <div className="mb-4  bg-white">
            <label className="form-label bg-white">
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
          <div className="mb-4 bg-white">
            <label className="form-label bg-white">
              Upload Photo <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={converToBase64Photo}
              required
            />
            {photo ? (
              <img
                src={photo}
                alt="preview"
                className="mt-2  bg-white"
                height={100}
                width={100}
              />
            ) : (
              <p class="text-danger small fst-italic mt-2 text-start bg-white">
                Image size limit: 200KB
              </p>
            )}
          </div>

          {/* Aadhaar */}
          <div className="mb-4  bg-white">
            <label className="form-label  bg-white">
              Upload Aadhaar <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={converToBase64kycDocument}
              required
            />
            {kycDocument ? (
              <img
                src={kycDocument}
                alt="preview"
                className="mt-2 rounded  bg-white"
                height={100}
                width={100}
              />
            ) : (
              <p class="text-danger small fst-italic mt-2 text-start bg-white">
                Image size limit: 200KB
              </p>
            )}
          </div>

          <div className="text-center mt-4  bg-white">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
