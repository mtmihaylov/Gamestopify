import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import {
  getAllOrders,
  processOrder,
  clearErrors,
} from "../../actions/orderActions";
import { PROCESS_ORDER_RESET } from "../../constants/orderConstants";

function OrdersList() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, orders, error } = useSelector((state) => state.allOrders);

  const {
    loading: processLoading,
    success: processSuccess,
    error: processError,
  } = useSelector((state) => state.processOrder);

  const [orderForm, setOrderForm] = useState({
    id: "",
    shippingInfo: {
      name: "",
      phone: "",
      address: "",
    },
    amount: "",
    payment: "",
    striepId: "",
    status: "",
    items: [],
  });

  const [orderStatus, setOrderStatus] = useState("Processing");

  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (processError) {
      alert.error(processError);
      dispatch({ type: PROCESS_ORDER_RESET });
      dispatch(clearErrors());
    }

    if (processSuccess) {
      alert.success("Order updated successfully");
      navigate("/admin/orders");
      dispatch({ type: PROCESS_ORDER_RESET });
    }
  }, [dispatch, alert, error, processError, processSuccess, navigate]);

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
      striepId: currentOrder.paymentInfo.id,
      status: currentOrder.orderStatus,
      items: currentOrder.orderItems,
    });
  };

  const handleClose = () => setShow(false);

  const updateOrder = (e) => {
    e.preventDefault();

    dispatch(processOrder(orderForm.id, { orderStatus })).then((res) => {
      handleClose();
    });
  };

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of items",
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
        },
      ],
      rows: [],
    };

    orders?.forEach((order) => {
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
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleShow(order._id)}
            >
              <i className="fa fa-truck mr-1"></i>
              <span>Process</span>
            </button>

            <button className="btn btn-danger ml-3">
              <i className="fa fa-times-circle mr-1"></i>
              <span>Delete</span>
            </button>
          </>
        ),
      });
    });

    return data;
  };

  return (
    <>
      <MetaData title="Admin Dashboard Orders" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar></Sidebar>
        </div>

        <div className="col-12 col-md-10 pl-0">
          <h1 className="my-4 text-center">All Orders</h1>

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
                  <Modal.Title>Process Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="col order-details">
                    <h2 className="mb-5">Order # {orderForm.id}</h2>

                    <h4 className="my-4">Update Status</h4>

                    <div className="order-status">
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="status"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      <button
                        className="btn btn-primary btn-block"
                        disabled={processLoading ? true : false}
                        onClick={updateOrder}
                      >
                        {processLoading ? (
                          <Spinner animation="border" variant="light" />
                        ) : (
                          "Update status"
                        )}
                      </button>
                    </div>

                    <hr />

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
                    <p
                      className={orderForm.payment ? "greenColor" : "redColor"}
                    >
                      <b>{orderForm.payment ? "Paid" : "Awaiting Payment"}</b>
                    </p>

                    <h4 className="my-4">Stripe ID</h4>
                    <p className="greenColor">
                      <b>{orderForm.striepId}</b>
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
      </div>
    </>
  );
}

export default OrdersList;
