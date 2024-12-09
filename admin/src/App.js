import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
    <Routes>
      <Route path='/'  element={<Login/>} />
      <Route path='/Dashboard/*'  element={<AdminDashboard/>} />
      </Routes>
      </Router>
  );
}

export default App;
