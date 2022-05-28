import "./App.css";
import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/Product/ProductDetails";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* <div className="container container-fluid"> */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        {/* </div> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
