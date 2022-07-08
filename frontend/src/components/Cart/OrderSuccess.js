import React, { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import MetaData from "../layout/MetaData";

import { useSelector } from "react-redux";

const OrderSuccess = () => {
  // const navigate = useNavigate();

  // const { isAuthenticated } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [navigate, isAuthenticated]);

  return (
    <>
      <MetaData title="Order placed successfully" />

      <div className="container container-fluid">
        <div className="row justify-content-center">
          <div className="col-6 mt-5 text-center">
            <img
              className="my-5 img-fluid d-block mx-auto"
              src="/images/success.png"
              alt="Success"
              width="200"
              height="200"
            />

            <h2>Your Order has been placed successfully.</h2>

            <Link to="/myprofile/orders">Go to Orders</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
