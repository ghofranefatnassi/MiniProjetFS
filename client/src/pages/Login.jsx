import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { AuthContext } from "../contexts/Authentificate"; // Import AuthContext
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext); // Use AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { emailVis: email, motDePasseVis: password };

    dispatch({ type: "LOGIN_START" }); // Indicate login process started

    try {
      const response = await fetch("http://localhost:3001/api/visiteurs/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store additional data in localStorage
        localStorage.setItem("visitorId", data.visiteur._id);
        localStorage.setItem("nomVis", data.visiteur.nomVis);

        // Dispatch login success
        dispatch({ type: "LOGIN_SUCCESS", payload: data.visiteur });

        // Display welcome toast
        toast.success(`Welcome, ${data.visiteur.nomVis}!`, {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect to home page
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: data.error });
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      dispatch({ type: "LOGIN_FAILURE", payload: "An error occurred" });
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link to="/register" className="text-decoration-underline text-info">
                    Register
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
