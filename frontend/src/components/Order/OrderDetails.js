import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { getOrderDetails, clearErrors } from "../../actions/orderActions";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const {
    user,
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    orderStatus,
  } = order;

  const fullAddress =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postCode}, ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  useEffect(() => {
    dispatch(getOrderDetails(id));

    if (error) {
      alert.error(error);

      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  return (
    <>
      <MetaData title="Order Details" />

      {loading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row d-flex">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5 ">Order # {id}</h1>

              <h4 className="mb-4">Shipping Info:</h4>
              <p>
                <b>Name:</b> {user?.name}
              </p>
              <p>
                <b>Phone:</b> {shippingInfo?.phoneNumber}
              </p>
              <p className="mb-4">
                <b>Address: </b>
                {fullAddress}
              </p>
              <p>
                <b>Amount:</b> ${totalPrice && totalPrice.toFixed(2)}
              </p>

              <hr />

              <h4 className="my-4">Payment:</h4>
              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>{isPaid ? "Paid" : "Awaiting Payment"}</b>
              </p>

              <hr />

              <h4 className="my-4">Order Status:</h4>
              <p
                className={
                  String(order.orderStatus).includes("Delivered")
                    ? "greenColor"
                    : "redColor"
                }
              >
                <b>{orderStatus}</b>
              </p>

              <hr />

              <h4 className="my-4">Order Items:</h4>
              {orderItems &&
                orderItems.map((item) => (
                  <div className="cart-item my-1" key={item.id}>
                    <hr />
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

                      <div className="col-5 col-lg-5">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0 pt-3">
                        <p>${item.price.toFixed(2)}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0 pt-3">
                        <p>{item.quantity} Piece(s)</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
