import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { MDBDataTable } from "mdbreact";
import { Modal } from "react-bootstrap";

import { myOrders, clearErrors } from "../../actions/orderActions";

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, orders, error } = useSelector((state) => state.myOrders);

  const [orderForm, setOrderForm] = useState({
    id: "",
    shippingInfo: {
      name: "",
      phone: "",
      address: "",
    },
    amount: "",
    payment: "",
    status: "",
    items: [],
  });

  const [orderStatus, setOrderStatus] = useState("Processing");

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, navigate, error, alert]);

  const [show, setShow] = useState(false);

  const handleShow = (id) => {
    setShow(true);

    const currentOrder = orders.find((order) => order._id === id);

    const address = `${currentOrder.shippingInfo.address}, ${currentOrder.shippingInfo.city}, ${currentOrder.shippingInfo.postCode}, ${currentOrder.shippingInfo.country}`;

    setOrderForm({
      id,
      shippingInfo: {
        name: currentOrder.user.name,
        phone: currentOrder.shippingInfo.phoneNumber,
        address,
      },
      amount: currentOrder.totalPrice,
      payment: currentOrder.paymentInfo.status === "succeeded" ? true : false,
      status: currentOrder.orderStatus,
      items: currentOrder.orderItems,
    });
  };

  const handleClose = () => setShow(false);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice.toFixed(2)}`,
        status: String(order.orderStatus).includes("Delivered") ? (
          <span className="greenColor">{order.orderStatus}</span>
        ) : (
          <span className="redColor">{order.orderStatus}</span>
        ),
        actions: (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleShow(order._id)}
          >
            <i className="fa fa-eye mr-1"></i>
            <span>Details</span>
          </button>
        ),
      });
    });

    return data;
  };

  return (
    <>
      <MetaData title="My Orders" />

      <div className="container container-fluid">
        <h1 className="my-5 text-center">My Orders</h1>

        {loading ? (
          <Loader />
        ) : (
          <>
            <MDBDataTable
              data={setOrders()}
              className="px-3"
              bordered
              striped
              hover
            />

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col order-details">
                  <h2 className="mb-5">Order # {orderForm.id}</h2>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {orderForm.shippingInfo.name}
                  </p>
                  <p>
                    <b>Phone:</b> {orderForm.shippingInfo.phone}
                  </p>
                  <p className="mb-4">
                    <b>Address:</b> {orderForm.shippingInfo.address}
                  </p>

                  <hr />

                  <h4 className="my-4">Payment</h4>
                  <p>
                    <b>Amount:</b> ${orderForm.amount}
                  </p>
                  <p className={orderForm.payment ? "greenColor" : "redColor"}>
                    <b>{orderForm.payment ? "Paid" : "Awaiting Payment"}</b>
                  </p>

                  <h4 className="my-4">Order Status</h4>
                  <p
                    className={
                      String(orderForm.status).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderForm.status}</b>
                  </p>

                  <h4 className="my-4">Order Items</h4>

                  <hr />
                  {orderForm.items?.map((item) => (
                    <div className="cart-item my-1" key={item.id}>
                      <div className="row my-5">
                        <div className="col-4 col-lg-2 mr-2">
                          <Link to={`/product/details/${item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              height="45"
                              width="65"
                            />
                          </Link>
                        </div>

                        <div className="col-5 col-lg-5">
                          <Link to={`/product/details/${item.id}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div className="col-6 col-lg-4 mt-4 mt-lg-0">
                          <p>${item.price.toFixed(2)}</p>
                          <p>{item.quantity} Piece(s)</p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default ListOrders;
