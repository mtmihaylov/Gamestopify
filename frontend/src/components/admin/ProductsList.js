import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { Modal, Spinner } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { MDBDataTable } from "mdbreact";

import {
  getAdminProducts,
  clearErrors,
  editProduct,
  deleteProduct,
} from "../../actions/productsActions";
import {
  DELETE_PRODUCT_RESET,
  EDIT_PRODUCT_RESET,
} from "../../constants/productConstants";

const ProductsList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading, products, error } = useSelector((state) => state.products);
  const {
    error: deleteProductError,
    success: deleteProductSuccess,
    loading: deleteProductLoading,
  } = useSelector((state) => state.deleteProduct);
  const {
    error: editProductError,
    success: editProductSuccess,
    loading: editProductLoading,
  } = useSelector((state) => state.editProduct);

  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    seller: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Electronics",
    "Computers",
    "Automotive",
    "Smart Home",
    "Arts and Craft",
    "Video Games",
    "Men's Fashion",
    "Women's Fashion",
    "Home and Kitchen",
    "Movies/Television",
    "Pet Supplies",
    "Sports",
    "Toys",
    "Books",
    "Food",
  ];

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteProductError) {
      alert.error(deleteProductError);
      dispatch(clearErrors());
    }

    if (editProductError) {
      alert.error(editProductError);
      dispatch(clearErrors());
    }

    if (deleteProductSuccess) {
      alert.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    if (editProductSuccess) {
      alert.success("Product updated successfully");
      navigate("/admin/products");
      dispatch({ type: EDIT_PRODUCT_RESET });
    }
  }, [
    dispatch,
    isAuthenticated,
    navigate,
    error,
    alert,
    deleteProductError,
    deleteProductSuccess,
    editProductError,
    editProductSuccess,
  ]);

  const [show, setShow] = useState(false);

  const handleShow = (id) => {
    setShow(true);

    const currentProduct = products.find((product) => product._id === id);

    setProductForm({
      id,
      name: currentProduct.name,
      price: currentProduct.price,
      description: currentProduct.description,
      category: currentProduct.category,
      seller: currentProduct.seller,
      stock: currentProduct.stock,
    });

    const imagesUrls = currentProduct.images.map((image) => image.url);

    setImagesPreview(imagesUrls);
  };
  const handleClose = () => setShow(false);

  const editHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", productForm.name);
    formData.set("price", productForm.price);
    formData.set("description", productForm.description);
    formData.set("category", productForm.category);
    formData.set("seller", productForm.seller);
    formData.set("stock", productForm.stock);
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(editProduct(productForm.id, formData)).then((res) => {
      handleClose();
    });
  };

  const onChange = (e) => {
    if (e.target.name === "images") {
      const files = Array.from(e.target.files);

      setImagesPreview([]);
      setImages([]);

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagesPreview((oldArray) => [...oldArray, reader.result]);
            setImages((oldArray) => [...oldArray, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setProductForm({ ...productForm, [e.target.name]: e.target.value });
    }
  };

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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleShow(product._id)}
            >
              <i className="fa fa-pencil mr-1"></i>
              <span>Edit</span>
            </button>

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

        <div className="col-12 col-md-10 pl-0">
          <h1 className="my-4 text-center">All Products</h1>

          {loading ? (
            <Loader />
          ) : (
            <>
              <MDBDataTable
                data={setProducts()}
                className="px-3"
                bordered
                striped
                hover
              />

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form
                    id="updateProductForm"
                    encType="multipart/form-data"
                    onSubmit={editHandler}
                  >
                    <div className="form-group">
                      <label htmlFor="name_field">Name</label>
                      <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        name="name"
                        value={productForm.name}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="price_field">Price</label>
                      <input
                        type="text"
                        id="price_field"
                        className="form-control"
                        name="price"
                        value={productForm.price}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description_field">Description</label>
                      <textarea
                        className="form-control"
                        id="description_field"
                        rows="4"
                        name="description"
                        value={productForm.description}
                        onChange={onChange}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="category_field">Category</label>
                      <select
                        className="form-control"
                        id="category_field"
                        name="category"
                        value={productForm.category}
                        onChange={onChange}
                      >
                        {categories &&
                          categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="stock_field">Stock</label>
                      <input
                        type="number"
                        id="stock_field"
                        className="form-control"
                        name="stock"
                        value={productForm.stock}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="seller_field">Seller Name</label>
                      <input
                        type="text"
                        id="seller_field"
                        className="form-control"
                        name="seller"
                        value={productForm.seller}
                        onChange={onChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Images</label>

                      <div className="custom-file">
                        <input
                          type="file"
                          name="images"
                          className="custom-file-input"
                          id="customFile"
                          multiple
                          onChange={onChange}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          Choose Images
                        </label>
                      </div>

                      {imagesPreview &&
                        imagesPreview.map((image) => (
                          <img
                            src={image}
                            alt="Images Preview"
                            key={image}
                            className="mt-3 mr-2"
                            width="55"
                            height="55"
                          />
                        ))}
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    type="submit"
                    form="updateProductForm"
                    className="btn btn-primary btn-block"
                    disabled={editProductLoading ? true : false}
                  >
                    {editProductLoading ? (
                      <Spinner animation="border" variant="light" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
