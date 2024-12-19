import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from "../components";
import axios from 'axios';

const AboutPage = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState({});

  // Unsplash API setup (replace with your own key)
  const UNSPLASH_API_KEY = 'M7qCy4lOLSMt1ZfBOoQw9M8YWiUvi8szKuyyqAYveXE';
  const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random?query=';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from your backend
        const categoriesResponse = await axios.get('http://localhost:3001/api/categories');  // Replace with your backend endpoint
        console.log('Categories:', categoriesResponse.data); // Log categories
        setCategories(categoriesResponse.data);

        // Fetch images for each category from Unsplash
        categoriesResponse.data.forEach(async (category) => {
          const response = await axios.get(`${UNSPLASH_API_URL}${category.nomCat}&client_id=${UNSPLASH_API_KEY}`);
          const imageUrl = response.data[0]?.urls?.small || ''; // Get small image URL
          console.log(`Image URL for category ${category.nomCat}:`, imageUrl); // Log the image URL

          setImages((prevImages) => ({
            ...prevImages,
            [category.nomCat]: imageUrl
          }));
        });

      } catch (error) {
        console.error('Error fetching categories or images:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit...
        </p>

        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          {categories.length === 0 ? (
            <div className="col-12 text-center">No categories available</div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="col-md-3 col-sm-6 mb-3 px-3">
                <div className="card h-100">
                  {/* Dynamically set the image URL */}
                  <img
                    className="card-img-top img-fluid"
                    src={images[category.nomCat] || 'https://via.placeholder.com/160'} // Fallback image if no image is found
                    alt={category.nomCat}
                    height={160}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">{category.nomCat}</h5>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
