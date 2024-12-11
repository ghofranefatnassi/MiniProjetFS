import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import {fetchVisitors} from '../../../api/api'
import './Visiteur.css'
const Visiteur = () => {
  const [visiteur,setVisiteur]= useState([]);

  const fetchVisiteursData = async () => {
    try {
      const data = await fetchVisitors();
      setVisiteur(data);
    } catch (error) {
      console.error("Failed to fetch cvisitors:", error);
    }
  };

  useEffect(() => {
    fetchVisiteursData();
  }, []);

  return (
    <div>
     <h1 className="titre">Visiteur</h1> 
     <Table striped bordered hover>
     <thead>
       <tr>
         <th>ID</th>
         <th>Nom Visiteur</th>
         <th>Email</th>
       </tr>
     </thead>
     <tbody>
       {visiteur.map((visitor) => (
         <tr key={visitor._id}>
           <td>{visitor._id}</td>
           <td>{visitor.nomVis}</td>
           <td>{visitor.emailVis}</td>
         </tr>
       ))}
     </tbody>
   </Table>
    </div>
  )
}

export default Visiteur
