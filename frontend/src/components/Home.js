import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productsActions";

import Product from './Product/Product';

const Home = () => {
  const dispatch = useDispatch();

  const { products, productsCount, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="container container-fluid">
      <MetaData title="Your shop for gaming, electronics and pop culture | GameStop" />

      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="container mt-5">
        <div className="row">
          {products && products.map((product) => (
              <Product key={product._id} product={product}/>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
