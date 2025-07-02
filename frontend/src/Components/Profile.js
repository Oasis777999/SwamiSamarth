import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userData = JSON.parse(stored);

    setUser(userData);
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img
                  src={user.photo}
                  alt="Profile"
                  className="rounded-circle shadow"
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                />
                <h3 className="mt-3 fw-bold">{user.name}</h3>
                <p className="text-muted mb-0">Welcome to your profile</p>
              </div>

              <hr className="my-4" />

              <div className="row gy-3">
                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Age</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.dob && !isNaN(new Date(user.dob).getTime())
                    ? new Date(user.dob).toLocaleDateString("en-GB")
                    : "N/A"}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Gender</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.gender}</p>
                  </div>
                </div>


                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Mobile</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.mobile}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Country</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.country}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">State</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.state}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">District</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.district}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Pincode</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.pincode}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="bg-lightBlue rounded-3 p-3 h-100">
                    <h6 className="text-muted bg-lightBlue">Address</h6>
                    <p className="mb-0 fw-semibold bg-lightBlue">{user.address}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
