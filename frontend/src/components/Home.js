import React, { useEffect, Fragment } from "react";

import MetaData from "./layout/MetaData";
import Product from "./Product/Product";
import Loader from "./layout/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert'
import { getProducts } from "../actions/productsActions";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { products, productsCount, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    
    dispatch(getProducts());
  }, [dispatch, alert, error]);

  return (
    <div className="container container-fluid">
      {loading ? <Loader/> : (
        <Fragment>
          <MetaData title="Your shop for gaming, electronics and pop culture | GameStop" />

          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </div>
  );
};

export default Home;
