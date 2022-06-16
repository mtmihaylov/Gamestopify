import "./App.css";
import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/Product/ProductDetails";

import Login from "./components/User/Login";
import Register from "./components/User/Register";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
