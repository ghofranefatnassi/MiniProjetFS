import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './Dashboard.css'; 
import { fetchVisitorCount,fetchCommandesCount,fetchStockCount,fetchCategories,updateProduct } from "../../../api/api";
const Dashboard = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [commandesCount, setCommandesCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const [categories, setCategories] = useState([]);
  const getVisitorCount = async () => {
    try {
      const data = await fetchVisitorCount();
      setVisitorCount(data.count); // Set the count in state
    } catch (error) {
      console.error("Error fetching visitor count:", error);
    }
  };
  const getCommandesCount = async () => {
    try {
      const data = await fetchCommandesCount();
      setCommandesCount(data.count); // Set the count in state
    } catch (error) {
      console.error("Error fetching commandes count:", error);
    }
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditingProduct(null);
    setNewStock("");
    setSelectedCategory("");
  };

  const handleShowEdit = (product) => {
    setEditingProduct(product);
    setNewStock(product.Stock);
    setSelectedCategory(product.idCategorie);
    setShowEdit(true);
  };

  const handleEditStock = async () => {
    if (newStock === "" || isNaN(newStock)) {
      setToastMessage("Please enter a valid stock value.");
      setToastShow(true);
      return;
    }

    if (!selectedCategory) {
      setToastMessage("Please select a valid category.");
      setToastShow(true);
      return;
    }

    try {
      await updateProduct(editingProduct._id, { Stock: newStock, idCategorie: selectedCategory });
      setToastMessage("Stock updated successfully!");
      setToastShow(true);
      fetchProductsData(); // Refresh products list
      handleCloseEdit();
    } catch (error) {
      setToastMessage("Failed to update stock.");
      setToastShow(true);
    }
  };

  const fetchProductsData = async () => {
    try {
      const data = await fetchStockCount(); // Fetch products with Stock < 5
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch low-stock products:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await fetchCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    getVisitorCount();
    getCommandesCount();
    fetchProductsData ();
    loadCategories();
  }, []);
  return (
    <div>
      <h1 className="titre">Tableau de bord</h1>
      <Container className="d-flex align-items-center">
        <Row className="justify-content-center align-items-center w-100">
          <Col md={5} className="custom-container mx-3">
            <i className="bx bx-male-female icon-style"></i>
            <span className="text-style">Visiteurs:</span>
            <span className="visitor-count">{visitorCount}</span>
          </Col>
          <Col md={5} className="custom-container mx-3">
            <i className="bx bx-notepad icon-style"></i>
            <span className="text-style">Commandes:</span>
            <span className="visitor-count">{commandesCount}</span>
          </Col>
        </Row>
      </Container>
      <div className='saus-titre'>Stocks</div>
      {products.length === 0 ? (
        <p>Tous les stocks sont suffisants. Aucun produit avec un stock inférieur à 5.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Categorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const categoryName = categories.find(cat => cat._id === product.idCategorie)?.nomCat || 'Unknown';
              return (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.nom}</td>
                  <td>{product.description}</td>
                  <td>{product.prix}</td>
                  <td>{product.Stock}</td>
                  <td>{categoryName}</td>
                  <td>
                    <Button variant="success" onClick={() => handleShowEdit(product)}>
                      Modifier Stock
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nouvelle Valeur de Stock</Form.Label>
              <Form.Control
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="Entrez le nouveau stock"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nomCat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleEditStock}>
            Mettre à Jour
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toastShow} onClose={() => setToastShow(false)} bg="success">
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Dashboard;
