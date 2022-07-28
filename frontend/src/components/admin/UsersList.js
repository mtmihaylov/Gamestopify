import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import { getAllUsers, editUser, clearErrors } from "../../actions/userActions";

import { EDIT_USER_RESET } from "../../constants/userConstants";

const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, users, error } = useSelector((state) => state.allUsers);
  const {
    loading: editUserLoading,
    isUpdated,
    error: editUserError,
  } = useSelector((state) => state.user);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (editUserError) {
      alert.error(editUserError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      dispatch({ type: EDIT_USER_RESET });
    }
  }, [dispatch, alert, error, editUserError, isUpdated]);

  const [show, setShow] = useState(false);

  const handleShow = (id) => {
    setShow(true);

    const currentUser = users.find((user) => user._id === id);

    setUserForm({
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    });

    setUserId(id);
  };
  const handleClose = () => setShow(false);

  const onChange = (e) => {
    setUserForm({
      ...setUserForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(editUser(userId, userForm)).then((res) => handleClose());
  };

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
            <button
              className="btn btn-primary"
              onClick={() => handleShow(user._id)}
            >
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

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form id="editUserForm" onSubmit={submitHandler}>
                    <div className="form-group">
                      <label htmlFor="name_field">Name</label>
                      <input
                        type="name"
                        id="name_field"
                        className="form-control"
                        name="name"
                        value={userForm.name}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email_field">Email</label>
                      <input
                        type="email"
                        id="email_field"
                        className="form-control"
                        name="email"
                        value={userForm.email}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="role_field">Role</label>

                      <select
                        id="role_field"
                        className="form-control"
                        name="role"
                        value={userForm.role}
                        onChange={onChange}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    type="submit"
                    form="editUserForm"
                    className="btn btn-primary btn-block"
                    disabled={editUserLoading ? true : false}
                  >
                    {editUserLoading ? (
                      <Spinner animation="border" variant="light" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersList;
