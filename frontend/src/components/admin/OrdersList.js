import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import { getAllOrders, clearErrors } from "../../actions/orderActions";

function OrdersList() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, orders, error } = useSelector((state) => state.allOrders);

  useEffect(() => {
    dispatch(getAllOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

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
            <button type="button" className="btn btn-primary">
              <i className="fa fa-pencil mr-1"></i>
              <span>Edit</span>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrdersList;
