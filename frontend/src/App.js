import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/Product/ProductDetails";

import Login from "./components/User/Login";
import Register from "./components/User/Register";

import Profile from "./components/User/Profile";
import ListOrders from "./components/Order/ListOrders";

import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSuccess from "./components/Cart/OrderSuccess";

import ForgotPassword from "./components/User/ForgotPassword";
import NewPassword from "./components/User/NewPassword";

import ProtectedRoute from "./components/Route/ProtectedRoute";

// Admin routes
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import OrdersList from "./components/admin/OrdersList";
import UsersList from "./components/admin/UsersList";
import ProductReviews from "./components/admin/ProductReviews";

import { loadUser } from "./actions/userActions";
import { useDispatch } from "react-redux";

import "./App.css";

import axios from "axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripe");
      setStripeApiKey(data.apiKey);
    }

    getStripeApiKey();
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/password/reset" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<NewPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/confirm"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />
        {/* {stripeApiKey && ( */}
        <Route
          path="/payment"
          element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            </Elements>
          }
        />
        {/* )} */}
        <Route path="/success" element={<OrderSuccess />} />
        <Route
          path="/myprofile/orders"
          element={
            <ProtectedRoute>
              <ListOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <ProductsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <NewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          isAdmin={true}
          element={
            <ProtectedRoute>
              <ProductReviews />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
