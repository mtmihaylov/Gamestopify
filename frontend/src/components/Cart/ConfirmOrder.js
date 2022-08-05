import React, { Fragment } from "react";

import "./ConfirmOrder.css";

import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Order prices
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const shippingPrice = subtotal > 100 ? 0 : 14.99;
  const tax = 0.05 * subtotal;
  const total = (subtotal + shippingPrice + tax).toFixed(2);

  const proceedToPayment = () => {
    const data = {
      subtotal: subtotal.toFixed(2),
      shippingPrice,
      tax: tax.toFixed(2),
      total,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <>
      <MetaData title="Confirm Order" />

      <CheckoutSteps shipping confirmOrder />

      <div className="container container-fluid">
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-5 order-confirm">
            <h4 className="mb-3">Shipping Info:</h4>
            <hr />
            <p>
              <b>Name:</b> {user?.name}
            </p>
            <p>
              <b>Phone:</b> {shippingInfo.phoneNumber}
            </p>
            <p className="mb-3">
              <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
              {shippingInfo.postCode}, {shippingInfo.country}
            </p>

            <hr />
            <h4 className="my-3">Your Cart Items:</h4>

            {cartItems.map((item) => (
              <Fragment key={item.id}>
                <hr />
                <div className="cart-item my-1">
                  <div className="row align-items-center">
                    <div className="col-4 col-lg-2">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </Link>
                    </div>

                    <div className="col-5 col-lg-6">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </div>

                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                      <p className="pt-3">
                        {`${item.quantity} x $${item.price.toFixed(2)} = `}
                        <b>${(item.quantity * item.price).toFixed(2)}</b>
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
              </Fragment>
            ))}
          </div>

          <div className="col-12 col-lg-3 my-4">
            <div id="order_summary">
              <h4 className="text-center">Order Summary</h4>
              <hr />
              <p>
                Subtotal:
                <span className="order-summary-values">
                  ${subtotal.toFixed(2)}
                </span>
              </p>
              <p>
                Shipping:{" "}
                <span className="order-summary-values">${shippingPrice}</span>
              </p>
              <p>
                Tax:{" "}
                <span className="order-summary-values">${tax.toFixed(2)}</span>
              </p>

              <hr />

              <p>
                Total:
                <span className="order-summary-values">${total}</span>
              </p>

              <hr />
              <button
                id="checkout_btn"
                className="btn btn-primary btn-block"
                onClick={proceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
