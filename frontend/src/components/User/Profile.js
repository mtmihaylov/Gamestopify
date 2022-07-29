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
  updatePassword,
  updateProfile,
} from "../../actions/userActions";

import { PROFILE_IS_UPDATED_RESET } from "../../constants/userConstants";

function Profile() {
  const { loading, user } = useSelector((state) => state.auth);
  const {
    error,
    isUpdated,
    loading: userLoading,
  } = useSelector((state) => state.user);

  const [updateProfileForm, setUpdateProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const { name, email, avatar } = updateProfileForm;
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setUpdateProfileForm({
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
  }, [dispatch, alert, error, isUpdated, user, navigate]);

  const [showUpdateProfileForm, setShowUpdateProfileForm] = useState(false);

  const handleUpdateProfileFormClose = () => setShowUpdateProfileForm(false);
  const handleUpdateProfileFormShow = () => setShowUpdateProfileForm(true);

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const handleChangePasswordFormClose = () => setShowChangePasswordForm(false);
  const handleChangePasswordFormShow = () => setShowChangePasswordForm(true);

  const editProfileSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const changePasswordSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("currentPassword", changePasswordForm.currentPassword);
    formData.set("newPassword", changePasswordForm.newPassword);

    dispatch(updatePassword(formData));
  };

  const onChangeEditProfile = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setUpdateProfileForm({ ...updateProfileForm, avatar: reader.result });
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUpdateProfileForm({
        ...updateProfileForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onChangePasswordUpdate = (e) => {
    setChangePasswordForm({
      ...changePasswordForm,
      [e.target.name]: e.target.value,
    });
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
                  onClick={handleUpdateProfileFormShow}
                >
                  Edit Profile
                </button>
                <Modal
                  show={showUpdateProfileForm}
                  onHide={handleUpdateProfileFormClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form
                      id="updateProfileForm"
                      encType="multipart/form-data"
                      onSubmit={editProfileSubmitHandler}
                    >
                      <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                          type="name"
                          id="name_field"
                          className="form-control"
                          name="name"
                          value={name}
                          onChange={onChangeEditProfile}
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
                          onChange={onChangeEditProfile}
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
                              onChange={onChangeEditProfile}
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
                      form="updateProfileForm"
                      className="btn btn-primary btn-block"
                      disabled={userLoading ? true : false}
                    >
                      {userLoading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </Modal.Footer>
                </Modal>

                <Link
                  to="/myprofile/orders"
                  className="btn btn-danger btn-block mt-3 main-color"
                >
                  My Orders
                </Link>

                <button
                  type="button"
                  className="btn btn-primary btn-block mt-3 main-color"
                  onClick={handleChangePasswordFormShow}
                >
                  Change Password
                </button>

                {/* Update Password Modal */}
                <Modal
                  show={showChangePasswordForm}
                  onHide={handleChangePasswordFormClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form
                      id="updatePasswordForm"
                      onSubmit={changePasswordSubmitHandler}
                    >
                      <div className="form-group">
                        <label htmlFor="current_password_field">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current_password_field"
                          className="form-control"
                          name="currentPassword"
                          onChange={onChangePasswordUpdate}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new_password_field">New Password</label>
                        <input
                          type="password"
                          id="new_password_field"
                          className="form-control"
                          name="newPassword"
                          onChange={onChangePasswordUpdate}
                        />
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      type="submit"
                      form="updatePasswordForm"
                      className="btn btn-primary btn-block"
                      disabled={userLoading ? true : false}
                    >
                      {userLoading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </Modal.Footer>
                </Modal>
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
