import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import { getAllUsers, clearErrors } from "../../actions/userActions";

const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, users, error } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getAllUsers());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    users?.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        actions: (
          <>
            <button className="btn btn-primary">
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
      <MetaData title="Admin Dashboard Users" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar></Sidebar>
        </div>

        <div className="col-12 col-md-10 pl-0">
          <h1 className="my-4 text-center">All Users</h1>

          {loading ? (
            <Loader />
          ) : (
            <>
              <MDBDataTable
                data={setUsers()}
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
};

export default UsersList;
