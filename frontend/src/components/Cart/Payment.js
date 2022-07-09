import React, { useState, useEffect } from "react";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { createOrder, clearErrors } from "../../actions/orderActions";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import axios from "axios";

const Payment = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [alert, error, dispatch]);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentData = {
    amount: Math.round(orderInfo.total * 100), // Аmount in cents for Stripe
  };

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo.subtotal;
    order.taxPrice = orderInfo.tax;
    order.shippingPrice = orderInfo.shippingPrice;
    order.totalPrice = orderInfo.total;
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    setDisabled(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      let res = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const clientSecret = res.data.client_secret;

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        alert.error(result.error);
        setDisabled(false);
      } else {
        // If the paymenet is processed or not
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          navigate("/success");
        } else {
          alert.error(
            "There was an issue processing your payment, please try again"
          );
        }
      }
    } catch (error) {
      setDisabled(false);
      alert.error(error);
    }
  };

  return (
    <>
      <MetaData title="Card Details" />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-md-4">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4 text-center">Card Details</h1>
            <div className="text-center mb-5">
              <img
                className="w-50 h-50"
                src="http://www.prepbootstrap.com/Content/images/shared/misc/creditcardicons.png"
                alt="Acceptable cards"
              ></img>
            </div>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
              />
            </div>

            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="card_exp_field">Expiration</label>
                  <CardExpiryElement
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="card_cvc_field">CVC</label>
                  <i
                    className="fa fa-question-circle ml-2 text-secondary tooltip pt-1"
                    aria-hidden="true"
                  ></i>
                  <span className="tooltip-content">
                    <img
                      src="https://res.cloudinary.com/best-cloud/image/upload/v1657142871/cvv_1_fxky5t.png"
                      alt="cvv"
                    />
                  </span>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <button
              id="pay_btn"
              type="submit"
              className="btn btn-block py-2"
              disabled={disabled}
            >
              Pay ${orderInfo.total}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
