import React, { useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, clearErrors } from "../../actions/productsActions";

import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (error) {
      alert.error(error);

      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name}/>
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <Carousel.Item key={image.public_id}>
                      <img
                        className="d-block w-100 h-100"
                        src={image.url}
                        alt={product.title}
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
                <span className="btn btn-secondary minus">-</span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value="1"
                  readOnly
                />

                <span className="btn btn-secondary plus">+</span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
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
              <button
                id="review_btn"
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#ratingModal"
              >
                Write a customer review
              </button>

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
                    <div className="modal-header">
                      <h5 className="modal-title" id="ratingModalLabel">
                        Submit Review
                      </h5>
                      <button
                        type="button"
                        className="btn fa fa-times fa-lg pr-0"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <ul className="stars">
                        <li className="star">
                          <i className="fa fa-star"></i>
                        </li>
                        <li className="star">
                          <i className="fa fa-star"></i>
                        </li>
                        <li className="star">
                          <i className="fa fa-star"></i>
                        </li>
                        <li className="star">
                          <i className="fa fa-star"></i>
                        </li>
                        <li className="star">
                          <i className="fa fa-star"></i>
                        </li>
                      </ul>

                      <textarea
                        name="review"
                        id="review"
                        className="form-control mt-3"
                      ></textarea>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary rounded-pill px-4"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn my-1 float-right review-btn px-4 text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProductDetails;
