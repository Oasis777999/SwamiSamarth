import React from "react";

const EditForm = () => {
  return (
    <div>
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <form className="modal-content" onSubmit={handleUpdate}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Agent</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingAgent?.name || ""}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingAgent?.mobile || ""}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, mobile: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">DOB</label>
                <input
                  type="date"
                  className="form-control"
                  value={editingAgent?.dob?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, dob: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingAgent?.state || ""}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, state: e.target.value })
                  }
                />
              </div>
              {/* Add more fields as needed */}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
