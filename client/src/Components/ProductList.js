import React, { useEffect, useState } from 'react';
import axios from 'axios';
 
const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    if (category) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3001/api/produits?category=${category}`);
          setProducts(response.data);
        } catch (error) {
          setError('Error fetching products');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
 
      fetchProducts();
    }
  }, [category]); // Run this effect whenever the category changes
 
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
 
  return (
<div className="container mt-5">
<h1 className="text-center mb-4">Products in Selected Category</h1>
<div className="row">
        {products.map((product) => (
<div key={product._id} className="col-md-4">
<div className="card" style={{ width: '18rem' }}>
<img
                src={`http://localhost:3001${product.photo}`}
                alt={product.nom}
                className="card-img-top"
              />
<div className="card-body">
<h5 className="card-title">{product.nom}</h5>
<p className="card-text">{product.description}</p>
<p className="card-text">
<strong>{product.prix}€</strong>
</p>
</div>
</div>
</div>
        ))}
</div>
</div>
  );
};
 
export default ProductList;