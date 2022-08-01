import React, { useEffect, Fragment, useState, useRef } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import MetaData from "../layout/MetaData";
import ProductCard from "../Product/ProductCard";
import Loader from "../layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";

import { getProducts } from "../../actions/productsActions";

import Pagination from "react-js-pagination";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const EnhancedSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 5000]);
  const [category, setCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [rating, setRating] = useState(0);
  const [activeRating, setActiveRating] = useState(0);

  const alert = useAlert();
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    productsPerPage,
    categories,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const { keyword } = useParams();

  const minInputRef = useRef(0);
  const maxInputRef = useRef(5000);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, price, category, rating]);

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, alert, error, currentPage, keyword, price, category, rating]);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const handleMinMaxPrice = () => {
    setPrice([minInputRef.current.value, maxInputRef.current.value]);
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Your shop for gaming, electronics and pop culture | GameStop" />

          <h1 id="products_heading" className="text-center">
            Latest Products
          </h1>

          <section id="products" className="container mt-5">
            <div className="row">
              <>
                <div className="col-6 col-md-3 mt-4">
                  <div className="px-5">
                    <div className="price-input mb-4">
                      <div className="field">
                        <input
                          ref={minInputRef}
                          type="number"
                          className="input-min mr-1"
                          placeholder="$Min"
                        />
                      </div>
                      <div className="field">
                        <input
                          ref={maxInputRef}
                          type="number"
                          className="input-max ml-1"
                          placeholder="$Max"
                        />
                      </div>
                      <button
                        className="btn btn-secondary ml-2 main-color"
                        onClick={() => handleMinMaxPrice()}
                      >
                        Go
                      </button>
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
                      tipFormatter={(value) => `$${value}`}
                    />
                    <hr className="mt-5 mb-4" />
                    <div className="mt-1">
                      <h4 className="mb-3">Categories</h4>
                      <ul className="pl-0">
                        <li
                          className={`category ${
                            activeCategory === "All" && "active"
                          }`}
                          onClick={() => {
                            setCategory("");
                            setActiveCategory("All");
                          }}
                        >
                          All
                        </li>
                        {categories &&
                          categories.map((category) => (
                            <li
                              key={category}
                              className={`category ${
                                activeCategory === category && "active"
                              }`}
                              onClick={() => {
                                setCategory(category);
                                setActiveCategory(category);
                              }}
                            >
                              {category}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <hr className="my-4" />
                    <div className="mt-1">
                      <h4 className="mb-3">Rating</h4>
                      <ul className="pl-0">
                        <li
                          className={`rating-filter ${
                            activeRating === 0 && "active"
                          }`}
                          onClick={() => {
                            setRating(0);
                            setActiveRating(0);
                          }}
                        >
                          All
                        </li>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <li
                            key={star}
                            className={`rating-filter ${
                              activeRating === rating && "active"
                            }`}
                            onClick={() => {
                              setRating(star);
                              setActiveRating(star);
                            }}
                          >
                            <div className="rating-outer">
                              <div
                                className="rating-inner"
                                style={{ width: `${star * 20}%` }}
                              ></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-9">
                  <div className="row">
                    {products &&
                      products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          col={4}
                        />
                      ))}
                  </div>
                </div>
                {/* {products.length > 0 ? (
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products.map((product) => (
                        <Product
                          key={product._id}
                          product={product}
                          col={4}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <h2 className="flex-grow-1 text-center mt-5">
                    Sorry, we couldn't find any results...
                  </h2>
                )} */}
              </>
            </div>
          </section>

          {filteredProductsCount > productsPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsPerPage}
                totalItemsCount={filteredProductsCount}
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

export default EnhancedSearch;
