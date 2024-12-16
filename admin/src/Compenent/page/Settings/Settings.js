import React, { useState } from 'react';
import './Settings.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { updateUser } from '../../../api/api';

const Settings = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });


  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(userData);
      alert(response.message);
    } catch (error) {
      alert(`Erreur: ${error.message || 'Une erreur est survenue'}`);
    }
  };

  return (
    <div>
      <h1 className="titre">Paramètres</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">
          <Form.Label column sm={2}>
            Nom d'utilisateur
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={userData.username}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
          <Form.Label column sm={2}>
            Mot de passe
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={userData.password}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Mise à jour</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Settings;
