import React, { useEffect, useState } from "react";
import stateData from "../State.json";
import logo from "../Images/Logo.png";
import api from "../apis/api";
import { useNavigate, useParams } from "react-router-dom"; // for getting agent ID from URL

export const UpdateAgent = () => {
  const { agentId } = useParams(); // Route param (e.g., /agent/edit/:agentId)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    password: "",
  });

  const [photo, setPhoto] = useState("");
  const [kycDocument, setKycDocument] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // ✅ Load existing data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const { data } = await api.get(`/user/${agentId}`); // Adjust as needed
        setFormData({
          name: data.name || "",
          mobile: data.mobile || "",
          dob: data.dob?.split("T")[0] || "",
          gender: data.gender || "",
          address: data.address || "",
          district: data.district || "",
          state: data.state || "",
          pincode: data.pincode || "",
          password: "", // Don't pre-fill password
        });
        setSelectedState(data.state || "");
        setSelectedDistrict(data.district || "");
        setPhoto(data.photo || "");
        setKycDocument(data.kycDocument || "");
      } catch (error) {
        console.error("Failed to fetch agent data", error);
      }
    };

    fetchAgent();
  }, [agentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertToBase64 = (e, setFunc) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert("File size must be ≤ 200 KB.");
      setFunc(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setFunc(reader.result);
    reader.onerror = (err) => console.error("File read error:", err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateData = new FormData();

      updateData.append("name", formData.name);
      updateData.append("gender", formData.gender);
      updateData.append("dob", formData.dob);
      updateData.append("mobile", formData.mobile);
      updateData.append("address", formData.address);
      updateData.append("state", selectedState);
      updateData.append("district", selectedDistrict);
      updateData.append("pincode", formData.pincode);
      updateData.append("photo", photo);
      updateData.append("kycDocument", kycDocument);
      updateData.append("password", formData.password);

      console.log("Data ", updateData);

      const response = await api.put(`/user/${agentId}`, updateData); // Adjust route as needed

      console.log("Response ", response);

      if (response) {
        alert("Agent updated successfully!");
        navigate("/agent-data");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update agent. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow p-4">
            <div className="container my-4">
              <div className="d-flex bg-lightBlue flex-column flex-sm-row align-items-center gap-3 p-3 border rounded shadow-sm">
                <img src={logo} alt="Logo" height="100" width="100" />
                <div>
                  <h3 className="text-warning fw-bold text-danger">
                    Dindoripranit
                  </h3>
                  <p className="text-muted">Shree Swami Samarth Seva Marg</p>
                  <h4 className="text-secondary fst-italic fs-6">
                    Akhil Bhartiya Shree Swami Samarth Gurupeeth
                  </h4>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white">
              {/* Repeat same fields as AddAgent */}
              {/* Example: Name */}
              <div className="mb-4 bg-white">
                <label className="form-label  bg-white">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DOB */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">Date of Birth</label>
                <input
                  type="date"
                  className="form-control "
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Gender */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">Gender</label>
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
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">Mobile</label>
                <input
                  type="number"
                  className="form-control"
                  name="mobile"
                  pattern="\d{10}"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              {/* State & District */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">State</label>
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
                    <option key={state} value={state} className=" bg-white">
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {selectedState && (
                <div className="mb-4  bg-white">
                  <label className="form-label  bg-white">District</label>
                  <select
                    className="form-select  bg-white"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                  >
                    <option value="">Select District</option>
                    {stateData[selectedState]?.map((district) => (
                      <option
                        key={district}
                        value={district}
                        className=" bg-white"
                      >
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Address */}
              <div className="mb-4  bg-white">
                <label className="form-label bg-white">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Pincode */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">Pincode</label>
                <input
                  type="number"
                  className="form-control"
                  name="pincode"
                  pattern="^[1-9][0-9]{5}$"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
              </div>

              {/* Photo */}
              <div className="mb-4  bg-white">
                <label className="form-label bg-white">Photo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => convertToBase64(e, setPhoto)}
                />
                {photo && (
                  <img
                    src={photo}
                    alt="Preview"
                    className="mt-2"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>

              {/* KYC */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">Aadhaar (KYC)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => convertToBase64(e, setKycDocument)}
                />
                {kycDocument && (
                  <img
                    src={kycDocument}
                    alt="KYC"
                    className="mt-2"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Password */}
              <div className="mb-4  bg-white">
                <label className="form-label  bg-white">
                  Password (leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success btn-lg">
                  Update Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
