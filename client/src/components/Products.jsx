import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "../contexts/CartContext"; // Import useCart hook

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart(); // Use addToCart from CartContext

  useEffect(() => {
    const getProductsAndCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/produits");
        const products = response.data;

        setData(products);
        setFilter(products);

        const categoriesResponse = await axios.get("http://localhost:3001/api/categories");
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching products or categories:", error);
        toast.error("Failed to fetch products or categories");
      } finally {
        setLoading(false);
      }
    };

    getProductsAndCategories();
  }, []);

  const filterProduct = async (category) => {
    setLoading(true);
    try {
      if (category === "all") {
        setFilter(data);
      } else {
        const response = await axios.get(
          `http://localhost:3001/api/produits/category/${category}`
        );
        setFilter(response.data);
      }
    } catch (error) {
      console.error("Error filtering products by category:", error);
      toast.error("Failed to fetch filtered products");
    } finally {
      setLoading(false);
    }
  };

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {Array(6)
        .fill()
        .map((_, index) => (
          <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <Skeleton height={592} />
          </div>
        ))}
    </>
  );

  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-5">
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct(category._id)}
          >
            {category.nomCat}
          </button>
        ))}
      </div>

      {filter.map((product) => (
        <div
          key={product._id}
          className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
        >
          <div className="card text-center h-100">
            <img
              className="card-img-top p-3"
              src={`http://localhost:3001${product.photo}`}
              alt={product.nom}
              height={300}
            />
            <div className="card-body">
              <h5 className="card-title">{product.nom.substring(0, 12)}...</h5>
              <p className="card-text">{product.description.substring(0, 90)}...</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item lead">$ {product.prix}</li>
            </ul>
            <div className="card-body">
              <Link to={`/product/${product._id}`} className="btn btn-dark m-1">
                Buy Now
              </Link>
              <button
                className="btn btn-dark m-1"
                onClick={() => {
                  addToCart(product); // Call addToCart from CartContext
                  toast.success(`${product.nom} added to cart`);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
