import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
 
const Navbar = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
 
  useEffect(() => {
    // Fetch categories when the component loads
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
 
    fetchCategories();
  }, []);
 
  const handleCategoryClick = async (idCategorie) => {
    onCategorySelect(idCategorie); // Pass the selected category to the parent component
  };
 
  return (
<div className="navbar">
<div className="nav-logo">
<img
          src="https://c7.alamy.com/comp/WAPMNA/online-shopping-ecommerce-sale-cartoon-WAPMNA.jpg"
          alt="icon"
        />
<p>SHOP NOW</p>
</div>
<ul className="nav-menu">
        {categories.map((category) => (
<li key={category._id} onClick={() => handleCategoryClick(category._id)}>
<Link style={{ textDecoration: 'none' }} to={`/${category.nomCat}`}>
              {category.nomCat}
</Link>
</li>
        ))}
</ul>
</div>
  );
};
 
export default Navbar;