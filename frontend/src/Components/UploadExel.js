import * as XLSX from "xlsx";
import { useState } from "react";
import { Link } from "react-router-dom";

export const UploadExel = () => {
  const [agentsFromExcel, setAgentsFromExcel] = useState([]);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Optional: validate required fields here
    console.log("Parsed Excel Data:", jsonData);
    setAgentsFromExcel(jsonData);
  };

  const handleBulkSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentsFromExcel),
      });

      const result = await res.json();
      alert("Volunteers uploaded successfully!");
      console.log(result);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error uploading Volunteers, Please chekck excel sheet formate!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">📤 Upload Volunteers via Excel</h4>

          {/* File Input */}
          <div className="mb-3">
            <label htmlFor="excelUpload" className="form-label">
              Select Excel File
            </label>
            <input
              type="file"
              id="excelUpload"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="form-control"
            />
          </div>

          {/* Action Buttons */}
          {agentsFromExcel.length > 0 && (
            <div className="row mt-3">
              <div className="col-12 col-md-auto mb-2">
                <button
                  onClick={handleBulkSubmit}
                  className="btn btn-success w-100"
                >
                  <i className="bi bi-upload"></i> Submit{" "}
                  {agentsFromExcel.length} Agents
                </button>
              </div>
              <div className="col-12 col-md-auto">
                <Link to="/data" className="btn btn-info w-100">
                  <i className="bi bi-eye"></i> See Updated List
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
