import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/Authentificate";
import { useCart } from "../contexts/CartContext"; // Correct use of CartContext

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { cartItems } = useCart(); // Access cartItems from CartContext

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
  };

  // Calculate the total number of items in the cart
  const cartCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          React Ecommerce
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
          </ul>
          <div className="buttons text-center">
            {user ? (
              <>
                <span className="navbar-text m-2">Hello, {user.nomVis}</span>
                <button className="btn btn-outline-dark m-2" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-dark m-2">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-dark m-2">
                  Register
                </NavLink>
              </>
            )}
            <NavLink to="/cart" className="btn btn-outline-dark m-2">
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({cartCount})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
