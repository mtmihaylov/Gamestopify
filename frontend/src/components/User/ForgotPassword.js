import React, { useState, useEffect } from "react";

import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../actions/userActions";

import { Spinner } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(`${message}`);
    }
  }, [error, alert, dispatch, message]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("email", email);

    dispatch(forgotPassword(formData));
  };

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <MetaData title="Forgot Password" />

      <div className="container-container-fluid">
        <div className="row wrapper">
          <div className="col-10 col-sm-auto">
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h1 className="mb-3">Forgot Password</h1>
              <div className="form-group">
                <label htmlFor="email_field">Enter Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={email}
                  onChange={onChange}
                />
              </div>

              <button
                id="forgot_password_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <Spinner animation="border" variant="dark" />
                ) : (
                  "Send Recovery Email"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
