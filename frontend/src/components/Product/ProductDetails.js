import React, { useEffect, Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import {
  getProductDetails,
  clearErrors,
  newReview,
} from "../../actions/productsActions";
import { addToCart } from "../../actions/cartActions";

import { NEW_REVIEW_RESET } from "../../constants/productConstants";

import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import ReviewList from "../Review/ReviewList";

import "./ProductDetails.css";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { error: reviewError, success } = useSelector((state) => state.review);

  // Variables for the stars in the review
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const stars = Array(5).fill(0);

  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (error) {
      alert.error(error);

      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);

      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, error, id, reviewError, success]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, quantity));

    alert.success("Item added to cart");
  };

  // 3 Functions for handling the star review coloring
  const handleClick = (value) => {
    setRatingValue(value);
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const reviewHandler = () => {
    const formData = new FormData();

    formData.set("rating", ratingValue);
    formData.set("comment", comment);
    formData.set("productId", id);

    dispatch(newReview(formData));
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <Carousel.Item key={image.public_id}>
                      <img
                        className="d-block"
                        src={image.url}
                        alt={product.title}
                        style={{
                          width: "100%",
                          height: "70vh",
                          objectFit: "scale-down",
                        }}
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                ></div>
              </div>
              <span id="no_of_reviews">
                ({product.numberOfReviews} Reviews)
              </span>

              <hr />

              <p id="product_price">${product.price}</p>

              <div className="stockCounter d-inline">
                <span
                  className="btn btn-secondary minus main-color"
                  onClick={decreaseQuantity}
                >
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span
                  className="btn btn-secondary plus main-color"
                  onClick={increaseQuantity}
                >
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                onClick={addToCartHandler}
                disabled={product.stock > 0 ? false : true}
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:{" "}
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                >
                  {product.stock > 0 ? "In Stock" : "Sold Out"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />

              <p id="product_seller mb-3">
                Sold By: <strong>{product.seller}</strong>
              </p>

              {/* <!-- Button trigger modal --> */}
              {isAuthenticated ? (
                <button
                  id="review_btn"
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#ratingModal"
                >
                  Write a customer review
                </button>
              ) : (
                <div className="alert alert-danger mt-5 text-center">
                  Login to post your review
                </div>
              )}

              {/* <!-- Modal --> */}
              <div
                className="modal fade"
                id="ratingModal"
                tabIndex="-1"
                aria-labelledby="ratingModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header text-center">
                      <h5
                        className="modal-title w-100 pl-4"
                        id="ratingModalLabel"
                      >
                        Submit a Review
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="stars">
                        {stars.map((_, index) => (
                          <i
                            className={`fa fa-star star ${
                              (hoverValue || ratingValue) > index
                                ? "yellow"
                                : ""
                            }`}
                            key={index}
                            onClick={() => handleClick(index + 1)}
                            onMouseOver={() => handleMouseOver(index + 1)}
                            onMouseLeave={handleMouseLeave}
                          ></i>
                        ))}
                      </div>

                      <textarea
                        name="review"
                        id="review"
                        className="form-control mt-3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary my-1 float-right px-4 text-white w-100"
                        onClick={reviewHandler}
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.reviews && <ReviewList reviews={product.reviews} />}
        </Fragment>
      )}
    </div>
  );
};

export default ProductDetails;
