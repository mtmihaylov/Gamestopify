import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { addToCart, removeItem } from "../../actions/cartActions";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Cart = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const decreaseQuantity = (id, quantity) => {
    if (quantity > 1) {
      dispatch(addToCart(id, quantity - 1));
    }
  };

  const increaseQuantity = (id, quantity, stock) => {
    if (quantity < stock) {
      dispatch(addToCart(id, quantity + 1));
    }
  };

  const removeItemHandler = (id) => {
    dispatch(removeItem(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <>
      <MetaData title="Shopping Cart" />

      {cartItems.length === 0 ? (
        <h2 className="mt-5 text-center">Your Cart Is Empty</h2>
      ) : (
        <div className="container container-fluid">
          <h2 className="mt-5 text-center">
            Your Cart: <b>{cartItems.length}</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <Fragment key={item.id}>
                  <hr />

                  <div className="cart-item">
                    <div className="row align-items-center">
                      <div className="col-4 col-lg-3">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            height="90"
                            width="115"
                          />
                        </Link>
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0 text-center">
                        <p id="card_item_price">${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0 text-center">
                        <div className="stockCounter d-inline">
                          <button
                            className="btn btn-secondary minus main-color"
                            onClick={() =>
                              decreaseQuantity(item.id, item.quantity)
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control count d-inline"
                            value={item.quantity}
                            readOnly
                          />

                          <button
                            className="btn btn-secondary plus main-color"
                            onClick={() =>
                              increaseQuantity(
                                item.id,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0 text-center">
                        <i
                          id="delete_cart_item"
                          className="fa fa-times-circle btn"
                          onClick={() => removeItemHandler(item.id)}
                        ></i>
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
                    {cartItems.reduce((acc, item) => {
                      return acc + item.quantity;
                    }, 0)}
                    (Units)
                  </span>
                </p>
                <p>
                  Est. total:
                  <span className="order-summary-values">
                    $
                    {cartItems
                      .reduce((acc, item) => {
                        return acc + item.price * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </p>

                <hr />
                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block"
                  onClick={checkoutHandler}
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
