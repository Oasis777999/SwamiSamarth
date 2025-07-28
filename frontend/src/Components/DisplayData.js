import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import locationData from "../State.json";
import PhotoPreview from "./PhotoPreview";
import api from "../apis/api";

export const DisplayData = () => {
  const [tableData, setTableData] = useState([]);
  const [filterdData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const getData = async () => {
    let result = await api.get("/data");
    let data =  result.data
    setTableData(data);
    setFilteredData(data);
  };

  const downloadExcel = async () => {
    try {
      const data = filterdData.map(({ name, gender,dob, mobile, address, county, state, district, pincode }) => ({
        name, gender,dob, mobile, address, county, state, district, pincode
      }));

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterData = () => {
    let filtered = tableData;

    if (selectedState) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((cell) =>
          cell?.toString().toLowerCase().includes(selectedState.toLowerCase())
        )
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((cell) =>
          cell
            ?.toString()
            .toLowerCase()
            .includes(selectedDistrict.toLowerCase())
        )
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((cell) =>
          cell?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterData();
  }, [tableData, selectedState, selectedDistrict, searchQuery]);

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
            onChange={handleSearch}
          />
        </div>

        {/* State Dropdown */}
        <div className="col-md-3 mb-2 mb-md-0">
          <select
            className="form-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict(""); // Reset district on state change
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
            onChange={(e) => setSelectedDistrict(e.target.value)}
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
            <i className="bi bi-file-earmark-arrow-up bg-success"></i> Add Bulk Volunteers
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
            {filterdData.map((item, index) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
