import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Categorie from '../page/categorie/Categorie';
import Visiteur from '../page/visiteur/Visiteur';
import Order from '../page/orders/Order';
import  Dashboard from '../page/Acceuil/Dashboard'
import './Dashboard.css'; 
import Produit from '../page/produits/Produit';
import ListeDeProduit from '../page/produits/ListeDeProduit';
import Settings from '../page/Settings/Settings';
const Dashbord = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categorie" element={<Categorie />} />
          <Route path="/produit/ajouter" element={<Produit />} />
          <Route path="/produit" element={<ListeDeProduit />} />
          <Route path="/visiteur" element={<Visiteur />} />
          <Route path="/commande" element={<Order />} />
          <Route path="/parametre" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashbord;
