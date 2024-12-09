import React, { useEffect, useState } from 'react';
import "./Produit.css";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { fetchCategories, addProduct } from '../../../api/api'; // Assuming API.js is in the same directory
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const Produit = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    idCategorie: '',
    photo: null,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // success, error, info, etc.

  // Fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await fetchCategories();
        setCategories(categoriesList);  // Populate categories from API
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append("nom", formData.nom);
    productData.append("description", formData.description);
    productData.append("prix", formData.prix);
    productData.append("idCategorie", formData.idCategorie);
    if (formData.photo) {
      productData.append("photo", formData.photo);
    }

    try {
      const response = await addProduct(productData);
      console.log("Product added:", response);
      setToastMessage('Produit ajouté avec succès!');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      console.error("Error adding product:", error);
      setToastMessage('Erreur lors de l\'ajout du produit');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <div>
      <h1 className="titre">Produits</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Nom de produit:</Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom produit"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Photo de produit</Form.Label>
          <Form.Control
            type="file"
            name="photo"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Prix</Form.Label>
            <Form.Control
              required
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              placeholder="Prix"
            />
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Categories</Form.Label>
            <Form.Select
              name="idCategorie"
              value={formData.idCategorie}
              onChange={handleChange}
              aria-label="Select Category"
            >
              <option>Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.nomCat} {/* Assuming nomCat is the category name */}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button type="submit">Ajouter</Button>
      </Form>
      <h3 className='saus-titre'>Liste des produits</h3>

      {/* Toast for Success/Error */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Produit;
