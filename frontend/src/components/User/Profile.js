import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

function Profile() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/login'/>
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="My Profile" />

          <div className="container container-fluid">
            <h2 className="mt-5 ml-5 text-center">My Profile</h2>
            <div className="row justify-content-around mt-5 user-info">
              <div className="col-12 col-md-3">
                <figure className="avatar avatar-profile">
                  <img
                    className="rounded-circle img-fluid"
                    src={user.avatar.url}
                    alt="avatar"
                  />
                </figure>
                <Link
                  to="/myprofile/edit"
                  id="edit_profile"
                  className="btn btn-primary btn-block mt-5"
                >
                  Edit Profile
                </Link>
                {user.role !== 'admin' && (
                  <Link
                  to="/myprofile/orders"
                  className="btn btn-danger btn-block mt-3"
                >
                  My Orders
                </Link>
                )}

                <Link
                  to="/password/update"
                  className="btn btn-primary btn-block mt-3"
                >
                  Change Password
                </Link>
              </div>

              <div className="col-12 col-md-5">
                <h4>Full Name</h4>
                <p>{user.name}</p>

                <h4>Email Address</h4>
                <p>{user.email}</p>

                <h4>Joined On</h4>
                <p>{user.createdAt.substring(0, 10)}</p>

                
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
