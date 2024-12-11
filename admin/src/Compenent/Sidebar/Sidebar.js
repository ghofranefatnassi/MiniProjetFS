import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="logo-details">
        <span className="logo_name">E-commerce</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/Dashboard/">
            <i className="bx bx-grid-alt"></i>
            <span className="link_name">Tableau de bord</span>
          </Link>
        </li>
        <li>
          <div className="iocn-link">
            <Link to="/Dashboard/categorie">
              <i className="bx bx-collection"></i>
              <span className="link_name">Categories</span>
            </Link>
          </div>
        </li>
        <li>
          <div className="iocn-link">
            <Link to="/Dashboard/produit">
              <i className="bx bx-package"></i>
              <span className="link_name">Produits</span>
            </Link>
          </div>
        </li>
        <li>
          <Link to="/Dashboard/visiteur">
            <i className="bx bx-male-female"></i>
            <span className="link_name">Visiteurs</span>
          </Link>
        </li>
        <li>
          <Link to="/Dashboard/order">
            <i className="bx bx-notepad"></i>
            <span className="link_name">Commandes</span>
          </Link>
        </li>
        <li>
          <div className="profile-details" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <i className="bx bx-log-out"></i>
            <span className="link_name">Logout</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
