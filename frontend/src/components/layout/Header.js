import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../actions/userActions";

import Search from "./Search";

import "../../App.css";

const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
  };

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/logo.png" alt="site logo" />
            </Link>
          </div>
        </div>

        <Search />

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-right">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <i
              className="fa fa-shopping-cart cart-icon"
              aria-hidden="true"
              value={cartItems.length}
            ></i>
          </Link>

          {user ? (
            <div className="dropdown ml-3 d-inline">
              <Link
                to="#"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    className="rounded-circle"
                    src={user.avatar && user.avatar.url}
                    alt={user.name}
                  />
                </figure>
                <span>{user.name?.split(" ")[0]}</span>
              </Link>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="dropDownMenuButton"
              >
                <Link to="/myprofile" className="dropdown-item">
                  <i class="fa fa-user fa-fw" aria-hidden="true"></i> Profile
                </Link>

                <Link to="/myprofile/orders" className="dropdown-item">
                  <i class="fa fa-shopping-basket fa-fw" aria-hidden="true"></i>{" "}
                  Orders
                </Link>

                {user.role === "admin" && (
                  <Link to="/dashboard" className="dropdown-item">
                    <i class="fa fa-tachometer fa-fw" aria-hidden="true"></i>{" "}
                    Dashboard
                  </Link>
                )}

                <div className="dropdown-divider"></div>

                <Link
                  to="/"
                  className="dropdown-item text-danger"
                  onClick={logoutHandler}
                >
                  <i class="fa fa-sign-out fa-fw" aria-hidden="true"></i> Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
