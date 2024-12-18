import {useState} from 'react'
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import ProductList from './Components/ProductList';  // Import the ProductList component

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
 
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // Update the selected category
  };
 
  return (
<div>
<BrowserRouter>
<Navbar onCategorySelect={handleCategorySelect} />
<Routes>
<Route path='/' element={<Shop />} />
<Route path='/homes' element={<ShopCategory category="home" />} />
<Route path='/fashions' element={<ShopCategory category="fashion" />} />
<Route path='/products' element={<Product />} />
<Route path=':productID' element={<Product />} />
</Routes>
        {/* Display ProductList based on the selected category */}
        {selectedCategory && <ProductList category={selectedCategory} />}
</BrowserRouter>
<h1>Bienvenue sur notre site e-commerce</h1>
</div>
  );
}
 
export default App;