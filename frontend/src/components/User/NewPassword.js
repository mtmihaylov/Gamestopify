import React, { useState, useEffect } from "react";

import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userActions";

import { useNavigate, useParams } from "react-router-dom";

import { Spinner } from "react-bootstrap";

const NewPassword = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  let { token } = useParams();

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password changed successfully");
      navigate("/login");
    }
  }, [error, alert, dispatch, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("password", passwords.password);
    formData.set("confirmPassword", passwords.confirmPassword);

    dispatch(resetPassword(token, formData));
  };

  const onChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <MetaData title="New Password Reset" />

      <div className="container-container-fluid">
        <div className="row wrapper">
          <div className="col-10 col-sm-auto">
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h1 className="mb-3">New Password</h1>

              <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  name="password"
                  value={passwords.password}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password_field">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password_field"
                  className="form-control"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={onChange}
                />
              </div>

              <button
                id="new_password_button"
                type="submit"
                className="btn btn-block py-3"
              >
                {loading ? (
                  <Spinner animation="border" variant="dark" />
                ) : (
                  "Set Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
