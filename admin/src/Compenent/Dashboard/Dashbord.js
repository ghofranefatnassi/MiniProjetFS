import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Categorie from '../page/categorie/Categorie';
import Visiteur from '../page/visiteur/Visiteur';
import Order from '../page/orders/Order';
import  Dashboard from '../page/Acceuil/Dashboard'
import './Dashboard.css'; 
import Produit from '../page/produits/Produit';
const Dashbord = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categorie" element={<Categorie />} />
          <Route path="/produit" element={<Produit />} />
          <Route path="/visiteur" element={<Visiteur />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashbord;
