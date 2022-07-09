import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { MDBDataTable } from "mdbreact";

import { myOrders, clearErrors } from "../../actions/orderActions";

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, orders, error } = useSelector((state) => state.myOrders);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, navigate, error, alert]);

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
          <p className="greenColor">{order.orderStatus}</p>
        ) : (
          <p className="redColor">{order.orderStatus}</p>
        ),
        actions: (
          <Link to={`/order/${order._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
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
          <MDBDataTable
            data={setOrders()}
            className="px-3"
            bordered
            striped
            hover
          />
        )}
      </div>
    </>
  );
};

export default ListOrders;
