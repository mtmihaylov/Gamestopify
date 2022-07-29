import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import { getProductReviews, clearErrors } from "../../actions/productsActions";

const ProductReviews = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, reviews, error } = useSelector(
    (state) => state.productReviews
  );

  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, productId]);

  const searchHandler = (e) => {
    e.preventDefault();

    dispatch(getProductReviews(productId));
  };

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "User Name",
          field: "userName",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    reviews?.forEach((review) => {
      data.rows.push({
        id: review._id,
        userName: review.name,
        rating: review.rating,
        comment: review.comment,
        actions: (
          <>
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
      <MetaData title="Admin Dashboard Product Reviews" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10 pl-0">
          <div className="row justify-content-center mt-5">
            <div className="col-5">
              <form onSubmit={searchHandler}>
                <div className="input-group">
                  <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Id ..."
                    onChange={(e) => setProductId(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button id="search_btn" className="btn">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {reviews?.length > 0 ? (
            <MDBDataTable
              data={setReviews()}
              className="px-3"
              bordered
              striped
              hover
            />
          ) : (
            <p className="mt-5 text-center">No Reviews</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
