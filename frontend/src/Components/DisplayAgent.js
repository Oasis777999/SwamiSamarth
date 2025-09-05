import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PhotoPreview from "./PhotoPreview";
import api from "../apis/api";
import { useNavigate } from "react-router-dom";

export const DisplayAgent = () => {
  const [tableData, setTableData] = useState([]);
  const [filterdData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true); // if you have a loading state
    try {
      const result = await api.get("/user/agent-data");
      const data = result.data;
      setTableData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = tableData.filter((row) =>
      Object.values(row).some((cell) =>
        cell?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const downloadExcel = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/agent-data"); // your API
      let data = response.data;

      console.log("Filtered Data : ", data);

      if (!Array.isArray(data)) {
        throw new Error("Data from API is not an array.");
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "exported-data.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/agent-delete/${id}`);

      // Optional: show success message
      alert("Agent deleted successfully");

      // Update local state (remove the deleted agent)
      setFilteredData((prev) => prev.filter((agent) => agent._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Failed to delete agent");
    }
  };
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--; // hasn't had birthday yet this year
    }

    return age;
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container py-5">
      {/* Header: Download + Search */}
      <div className="row sticky-top align-items-center py-4">
        <div className="col-md-6 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, mobile, etc..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-6 text-md-end text-center">
          <button onClick={downloadExcel} className="btn btn-success">
            📥 Download List
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filterdData.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              filterdData.map((item, index) => (
                <tr key={item._id}>
                  <td className="text-center fw-bold">{index + 1}</td>
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
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      <i className="bi bi-trash bg-danger"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-warning m-1"
                      onClick={() => navigate(`/update/${item._id}`)}
                    >
                      <i className="bi bi-pencil-square bg-warning"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
