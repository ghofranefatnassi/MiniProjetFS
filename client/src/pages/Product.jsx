//page mehya lil checkout
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch product details from your backend
        const response = await fetch(`http://localhost:3001/api/produits/${id}`);
        
        // Check for 404 or any other errors
        if (!response.ok) {
          throw new Error(`Product with id ${id} not found`);
        }

        const data = await response.json();
        setProduct(data);

      

        setLoading(false);
      
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
        
      }
    };

    getProduct();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => {
    if (!product) {
      return <div className="alert alert-danger">Product not found or failed to load!</div>;
    }

    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={`http://localhost:3001${product.photo}`}  // Assuming image is served from /uploads
              alt={product.nom}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-5">{product.nom}</h1>
            <h3 className="display-6 my-4">${product.prix}</h3>
            <p className="lead">{product.description}</p>
            <button className="btn btn-outline-dark">Add to Cart</button>
            <Link to="/cart" className="btn btn-dark mx-3">Go to Cart</Link>
          </div>
        </div>
      </div>
    );
  };



 
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          {loading ? <Loading /> : <ShowProduct />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
