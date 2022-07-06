import React, { useState, useEffect } from "react";

import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const Payment = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {}, []);

  return (
    <>
      <MetaData title="Card Details" />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-md-4">
          <form className="shadow-lg">
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
                    className="fa fa-question-circle ml-2 text-secondary"
                    aria-hidden="true"
                  ></i>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-2">
              Pay
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
