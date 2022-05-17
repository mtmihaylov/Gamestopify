import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* <div className="container container-fluid"> */}
          <Route path="/" element={<Home />} />
        {/* </div> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
