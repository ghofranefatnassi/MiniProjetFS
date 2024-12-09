import React, { useState, useEffect } from 'react';
import './categorie.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../../api/api';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastShow, setToastShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShow = () => setShow(true);
  const handleShowDelete = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setShowDelete(true);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;

    try {
      await addCategory({ nomCat: newCategory });
      setToastMessage('Category added successfully!');
      setToastShow(true);
      setNewCategory('');
      fetchCategoriesData();
    } catch (error) {
      setToastMessage('Failed to add category.');
      setToastShow(true);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategoryName) return;

    try {
      await updateCategory(editingCategory._id, { nomCat: editingCategoryName });
      setToastMessage('Category updated successfully!');
      setToastShow(true);
      setEditingCategory(null);
      setEditingCategoryName('');
      fetchCategoriesData();
      setShow(false);
    } catch (error) {
      setToastMessage('Failed to update category.');
      setToastShow(true);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(deleteCategoryId);
      setToastMessage('Category deleted successfully!');
      setToastShow(true);
      setDeleteCategoryId(null);
      fetchCategoriesData();
      setShowDelete(false);
    } catch (error) {
      setToastMessage('Failed to delete category.');
      setToastShow(true);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <div>
      <h1 className="titre">Categories</h1>
      <InputGroup className="mb-3">
        <Form.Control
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Ajouter categorie"
          aria-describedby="basic-addon2"
        />
        <Button variant="outline-primary" onClick={handleAddCategory}>
          Ajouter
        </Button>
      </InputGroup>
      <h3 className='saus-titre'>Liste des categories</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom categorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.nomCat}</td>
              <td>
                <Button variant="danger" onClick={() => handleShowDelete(category._id)}>
                  Supprimer
                </Button>
                <Modal show={showDelete} onHide={handleCloseDelete}>
                  <Modal.Header closeButton>
                    <Modal.Title>Supprimer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer ceci ?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                      Non
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCategory}>
                      Oui
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Button variant="success" onClick={() => { setEditingCategory(category); setEditingCategoryName(category.nomCat); handleShow(); }}>
                  Modifier
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modifier</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Nom categorie</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="success" onClick={handleEditCategory}>
                      Modifier
                    </Button>
                  </Modal.Footer>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toastShow}
          onClose={() => setToastShow(false)}
          delay={3000}
          autohide
          bg="primary"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Categorie;
