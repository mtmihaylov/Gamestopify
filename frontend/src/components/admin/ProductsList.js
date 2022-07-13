import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import {
  getAdminProducts,
  clearErrors,
  deleteProduct,
} from "../../actions/productsActions";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductsList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, products, error } = useSelector((state) => state.products);
  const { error: deleteProductError, success } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    dispatch(getAdminProducts());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteProductError) {
      alert.error(deleteProductError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    isAuthenticated,
    navigate,
    error,
    alert,
    deleteProductError,
    success,
  ]);

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    products?.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary"
            >
              <i className="fa fa-pencil mr-1"></i>
              <span>Edit</span>
            </Link>
            <button
              className="btn btn-danger ml-3"
              onClick={() => deleteHandler(product._id)}
            >
              <i className="fa fa-times-circle mr-1"></i>
              <span>Delete</span>
            </button>
          </>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <>
      <MetaData title="Admin Dashboard Products" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar></Sidebar>
        </div>

        <div className="col-12 col-md-10">
          <h1 className="my-4 text-center">All Products</h1>

          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
              className="px-3"
              bordered
              striped
              hover
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
