import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import locationData from "../State.json";
import PhotoPreview from "./PhotoPreview";
import api from "../apis/api";

export const DisplayData = () => {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 50;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await api.get("/person/data", {
        params: {
          page,
          limit,
          search: searchQuery,
          state: selectedState,
          district: selectedDistrict,
        },
      });
      setTableData(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, searchQuery, selectedState, selectedDistrict]);

  const downloadExcel = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedState) params.append("state", selectedState);
      if (selectedDistrict) params.append("district", selectedDistrict);

      const url = `/person/export?${params.toString()}`;

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "filtered-data.xlsx");
    } catch (error) {
      console.error("Error downloading Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container py-5">
      {/* Header: Download + Search */}
      <div className="row sticky-top align-items-center mb-4 pt-5">
        {/* Search Input */}
        <div className="col-md-5 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, mobile, etc..."
            value={searchQuery}
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        {/* State Dropdown */}
        <div className="col-md-3 mb-2 mb-md-0">
          <select
            className="form-select"
            value={selectedState}
            onChange={(e) => {
              setPage(1);
              setSelectedState(e.target.value);
              setSelectedDistrict("");
            }}
          >
            <option value="">🌐 All States</option>
            {Object.keys(locationData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div className="col-md-3 mb-3 mb-md-0">
          <select
            className="form-select"
            value={selectedDistrict}
            onChange={(e) => {
              setPage(1);
              setSelectedDistrict(e.target.value);
            }}
            disabled={!selectedState}
          >
            <option value="">🏙️ All Districts</option>
            {selectedState &&
              locationData[selectedState]?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>

        {/* Reset Filter */}
        <button
          className="btn btn-outline-primary col-md-1 mb-2 mb-md-0 fs-5 bg-light text-primary"
          onClick={() => {
            setPage(1);
            setSelectedState("");
            setSelectedDistrict("");
            setSearchQuery("");
          }}
        >
          <i className="bi bi-arrow-repeat"></i> Reset
        </button>

        {/* Buttons Bulk uploads and downloadlist */}
        <div className="col-md-12 text-md-end text-center mt-3">
          <Link to="/bulk-upload" className="btn btn-success m-1">
            <i className="bi bi-file-earmark-arrow-up bg-success"></i> Add Bulk
            Volunteers
          </Link>
          <button
            onClick={downloadExcel}
            className="btn btn-outline-success m-1 bg-light text-success"
          >
            <i className="bi bi-file-earmark-arrow-down"></i> Download List
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle table-striped">
          <thead className="table-primary text-center">
            <tr>
              <th scope="col">Sr.No</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Age</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>State</th>
              <th>District</th>
              <th>Pin</th>
              <th>Address</th>
              <th>Photo</th>
              <th>KYC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? ( // ⬅️ Added
              <tr>
                <td colSpan={12} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? ( // ⬅️ Updated
              <tr>
                <td colSpan={12} className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              tableData.map((item, index) => (
                <tr key={item._id}>
                  <td className="text-center fw-bold">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {item.dob && !isNaN(new Date(item.dob).getTime())
                      ? new Date(item.dob).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td>
                    {item.dob && !isNaN(new Date(item.dob).getTime())
                      ? calculateAge(new Date(item.dob)) + " yrs"
                      : "N/A"}
                  </td>
                  <td>{item.mobile}</td>
                  <td>{item.gender}</td>
                  <td>{item.state}</td>
                  <td>{item.district}</td>
                  <td>{item.pincode}</td>
                  <td>{item.address}</td>
                  <td className="text-center">
                    <PhotoPreview item={item.photo} />
                  </td>
                  <td className="text-center">
                    <PhotoPreview item={item.kycDocument} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="fs-5">
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page === Math.ceil(total / limit) || total === 0}
          onClick={() =>
            setPage((p) => Math.min(Math.ceil(total / limit), p + 1))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};
