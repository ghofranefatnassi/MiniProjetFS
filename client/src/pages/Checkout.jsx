import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null); // To store the logged-in user's ID

  useEffect(() => {
    // Retrieve cart data from localStorage when the component mounts
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    // Retrieve the logged-in user's ID from localStorage
    const loggedInUserId = localStorage.getItem('idVisiteur');
    setUserId(loggedInUserId); // Set the logged-in user ID
  }, []);

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    // Calculate subtotal and total items
    cart.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    const handleCheckout = async () => {
      const token = localStorage.getItem('token'); // JWT token to verify if user is logged in

      if (!token) {
        // If not logged in, redirect to login page
        window.location.href = '/login';
        return;
      }

      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      // Use the logged-in user's ID from state
      const idVisiteur = userId || 'visitor123'; // Fallback to 'visitor123' if no userId

      const orderData = {
        idVisiteur,
        date: new Date(),
        statut: 'pending', // Or whatever status is applicable
        cart: cart.map(item => ({
          itemId: item.id, // Use the actual product ID
          quantity: item.qty,
          price: item.price,
        })),
      };

      try {
        const response = await axios.post('/api/commande/commande', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Order placed:', response.data);
        alert('Your order has been placed successfully!');

        // Clear the cart after checkout
        localStorage.removeItem('cart');

        // Optionally, redirect to an order confirmation page
        window.location.href = '/order-confirmation';
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Error during checkout');
      }
    };

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" novalidate>
                    {/* Billing Form Fields */}
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Valid last name is required.
                        </div>
                      </div>

                      {/* More fields for email, address, etc. */}
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment</h4>

                    <div className="row gy-3">
                      {/* Payment Fields */}
                    </div>

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary"
                      type="button"
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                    >
                      Continue to checkout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {cart.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
