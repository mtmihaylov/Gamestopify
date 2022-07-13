import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

import { Spinner } from "react-bootstrap";

import { newProduct, clearErrors } from "../../actions/productsActions";

import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

const NewProduct = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "Electronics",
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

  const { loading, success, error } = useSelector((state) => state.newProduct);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      dispatch({ type: NEW_PRODUCT_RESET });
    }

    if (success) {
      navigate("/admin/products");

      alert.success("Product created successfully");

      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, navigate, error, alert, success]);

  const submitHandler = (e) => {
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

    dispatch(newProduct(formData));
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

  return (
    <>
      <MetaData title="Admin Dashboard Products" />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar></Sidebar>
        </div>

        <div className="col-12 col-md-10">
          <div className="wrapper my-5">
            <form
              className="shadow-lg"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <h1 className="mb-4">New Product</h1>

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
                  <label className="custom-file-label" htmlFor="customFile">
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

              <button
                type="submit"
                className="btn btn-block py-3"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <Spinner animation="border" variant="dark" />
                ) : (
                  "CREATE"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;
