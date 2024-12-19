import React, { useState, useEffect, useContext } from 'react';
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/Authentificate"; // Import AuthContext
import axios from 'axios';

const Cart = () => {
  const { user } = useContext(AuthContext); // Access user and dispatch from AuthContext
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(30.0);
  const [totalItems, setTotalItems] = useState(0);
console.log(user);
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get(`/api/paniers/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setCart(response.data.produits);
          })
          .catch((error) => console.error("Error fetching cart:", error));
      }
    } else {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    }
  }, [user]);

  useEffect(() => {
    let newSubtotal = 0;
    let newTotalItems = 0;
    cart.forEach(item => {
      newSubtotal += item.totalPrice;
      newTotalItems += item.quantity;
    });
    setSubtotal(newSubtotal);
    setTotalItems(newTotalItems);
  }, [cart]);

  const addItem = (product) => {
    const newCart = [...cart];
    const index = newCart.findIndex((item) => item.produit._id === product.id);
  
    if (index !== -1) {
      newCart[index].quantity += 1;
      newCart[index].totalPrice = newCart[index].quantity * newCart[index].produit.prix;
    } else {
      newCart.push({ produit: product, quantity: 1, totalPrice: product.prix });
    }
  
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  
    const token = localStorage.getItem('authToken');
  
    if (token) {
      axios.post(`/api/panier/ajouter`, {
        idVisiteur: user.id,
        produitId: product.id,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(response => {
        console.log("Item added successfully:", response.data);
      }).catch((error) => {
        console.error("Error adding item to cart:", error);
      });
    } else {
      console.error("Token is missing. Cannot add item to cart.");
    }
  };
  

  const removeItem = (product) => {
    const newCart = cart.filter(item => item.produit._id !== product._id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    const token = localStorage.getItem('authToken');
    axios.patch(`/api/panier/${product._id}`, {
      produitId: product._id,
      quantity: 0,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => console.error("Error removing item from cart:", error));
  };

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item.produit._id}>
                            <td>
                              <img
                                src={item.produit.image}
                                alt={item.produit.title}
                                width={50}
                                height={50}
                              />
                              <span className="ms-2">{item.produit.title}</span>
                            </td>
                            <td>${item.produit.prix}</td>
                            <td>
                              <div className="d-flex">
                                <button className="btn btn-outline-secondary me-2" onClick={() => removeItem(item)}>
                                  <i className="fas fa-minus"></i>
                                </button>
                                {item.quantity}
                                <button className="btn btn-outline-secondary ms-2" onClick={() => addItem(item.produit)}>
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td>${item.totalPrice}</td>
                            <td>
                              <button className="btn btn-danger" onClick={() => removeItem(item)}>
                                <i className="fas fa-trash"></i> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products ({totalItems}) <span>${Math.round(subtotal)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping <span>${shipping}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div><strong>Total amount</strong></div>
                        <span><strong>${Math.round(subtotal + shipping)}</strong></span>
                      </li>
                    </ul>

                    <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                      Go to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {cart.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
