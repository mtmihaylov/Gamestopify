import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Spinner, Modal } from "react-bootstrap";

import {
  clearErrors,
  loadUser,
  updateProfile,
} from "../../actions/userActions";

import { PROFILE_IS_UPDATED_RESET } from "../../constants/userConstants";

function Profile() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    error,
    isUpdated,
    loading: userLoading,
  } = useSelector((state) => state.user);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const { name, email, avatar } = userForm;
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (user) {
      setUserForm({
        name: user.name,
        email: user.email,
        avatar: "",
      });
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Profile Updated Successfully");
      dispatch(loadUser());

      dispatch({
        type: PROFILE_IS_UPDATED_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated, user, navigate, isAuthenticated]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setUserForm({ ...userForm, avatar: reader.result });
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserForm({ ...userForm, [e.target.name]: e.target.value });
    }
  };

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
                <div className="avatar-container">
                  <figure className="avatar avatar-profile">
                    <img
                      className="rounded-circle img-fluid"
                      src={user?.avatar?.url}
                      alt="avatar"
                    />
                  </figure>
                  <div className="avatar__overlay">
                    <Link to="#" className="btn text-white update-avatar">
                      Update Avatar
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block mt-5 main-color"
                  onClick={handleShow}
                >
                  Edit Profile
                </button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form
                      id="userForm"
                      encType="multipart/form-data"
                      onSubmit={submitHandler}
                    >
                      <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                          type="name"
                          id="name_field"
                          className="form-control"
                          name="name"
                          value={name}
                          onChange={onChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                          type="email"
                          id="email_field"
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={onChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                          <div>
                            <figure className="avatar mr-3 item-rtl">
                              <img
                                src={avatarPreview}
                                className="rounded-circle"
                                alt="Avatar Preview"
                              />
                            </figure>
                          </div>
                          <div className="custom-file">
                            <input
                              type="file"
                              name="avatar"
                              className="custom-file-input"
                              id="customFile"
                              accept="image/*"
                              onChange={onChange}
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              Choose Avatar
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      type="submit"
                      form="userForm"
                      className="btn btn-primary btn-block"
                    >
                      {userLoading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </Modal.Footer>
                </Modal>

                {user.role !== "admin" && (
                  <Link
                    to="/myprofile/orders"
                    className="btn btn-danger btn-block mt-3 main-color"
                  >
                    My Orders
                  </Link>
                )}

                <Link
                  to="/password/update"
                  className="btn btn-primary btn-block mt-3 main-color"
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
                <p>{user?.createdAt?.substring(0, 10)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
