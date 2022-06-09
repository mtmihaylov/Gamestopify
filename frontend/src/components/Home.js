import React, { useEffect, Fragment, useState, useRef } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import MetaData from "./layout/MetaData";
import Product from "./Product/Product";
import Loader from "./layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getProducts } from "../actions/productsActions";
import { useParams } from "react-router-dom";

import Pagination from "react-js-pagination";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 5000]);
  
  const minInputRef = useRef(0)
  const maxInputRef = useRef(5000)

  const alert = useAlert();
  const dispatch = useDispatch();

  const { products, productsCount, loading, error, productsPerPage } =
    useSelector((state) => state.products);

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, alert, error, currentPage, keyword, price]);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  // TODO : Min Price and Max Price input handlers

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Your shop for gaming, electronics and pop culture | GameStop" />

          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 my-5">
                    <div className="px-5">
                      <div className="price-input mb-4">
                        <div className="field">
                          <input ref={minInputRef} type="number" className="input-min mr-1" placeholder="$Min"/>
                        </div>
                        <div className="field">
                          <input ref={maxInputRef} type="number" className="input-max ml-1" placeholder="$Max"/>
                        </div>
                        <button className="btn btn-secondary ml-2 main-color">Go</button>
                      </div>
                      <Range
                        marks={{
                          0: "$0",
                          5000: "$5000",
                        }}
                        min={0}
                        max={5000}
                        defaultValue={price}
                        allowCross={false}
                        pushable={100}
                        step={50}
                        onAfterChange={(price) => setPrice(price)}
                        tipFormatter={value => `$${value}`}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>

          {productsCount > productsPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsPerPage}
                totalItemsCount={productsCount}
                onChange={handlePageChange}
                nextPageText={"Next"}
                prevPageText={"Previous"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Home;
