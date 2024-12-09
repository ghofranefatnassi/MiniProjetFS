import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { fetchProducts, updateProduct, deleteProduct, fetchCategories } from '../../../api/api';
import { useNavigate } from "react-router-dom";
import './Produit.css'

const ListeDeProduit = () => {
  const navigate = useNavigate();
  
  const goToAddProduct = () => {
    navigate("/Dashboard/produit/ajouter");
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductData, setEditingProductData] = useState({
    nom: "",
    description: "",
    prix: "",
    Stock: "",
    idCategorie: "",
    photo: "",  // file object
  });
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowEdit = (product) => {
    setEditingProduct(product);
    setEditingProductData({
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      Stock: product.Stock,
      idCategorie: product.idCategorie,
      photo: product.photo || "",
    });
    setShowEdit(true);
  };
  const handleShowDelete = (productId) => {
    setDeleteProductId(productId);
    setShowDelete(true);
  };

  const handleEditProduct = async () => {
    if (!editingProductData.nom || !editingProductData.description || !editingProductData.prix || !editingProductData.Stock || !editingProductData.idCategorie) {
      setToastMessage("Please fill in all fields.");
      setToastShow(true);
      return;
    }

    // Create FormData to handle the file upload along with the form data
    const formData = new FormData();
    formData.append("nom", editingProductData.nom);
    formData.append("description", editingProductData.description);
    formData.append("prix", editingProductData.prix);
    formData.append("Stock", editingProductData.Stock);
    formData.append("idCategorie", editingProductData.idCategorie);

    // If there's a photo, append it to FormData
    if (editingProductData.photo && editingProductData.photo instanceof File) {
      formData.append("photo", editingProductData.photo);
    } else {
      formData.append("photo", editingProductData.photo);  // Keep existing photo URL if no new photo
    }

    try {
      await updateProduct(editingProduct._id, formData);
      setToastMessage("Produit a modifier avec succès !");
      setToastShow(true);
      setEditingProduct(null);
      setEditingProductData({
        nom: "",
        description: "",
        prix: "",
        Stock: "",
        idCategorie: "",
        photo: "",
      });
      fetchProductsData();
      setShowEdit(false);
    } catch (error) {
      setToastMessage("Échec de modifier du produit.");
      setToastShow(true);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(deleteProductId);
      setToastMessage("Produit a supprimer avec succès!");
      setToastShow(true);
      setDeleteProductId(null);
      fetchProductsData();
      setShowDelete(false);
    } catch (error) {
      setToastMessage("Échec de supprimer du produit");
      setToastShow(true);
    }
  };

  const fetchProductsData = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await fetchCategories();
      setCategories(categoriesList); // Populate categories from API
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProductsData();
    loadCategories(); // Load categories on component mount
  }, []);

  return (
    <div>
      <h1 className="titre">Produits</h1>
      <button type="button" className="btn btn-primary" onClick={goToAddProduct}>Ajouter un Produit</button>
      <h3 className="saus-titre">Liste des Produits</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Categorie</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const category = categories.find((cat) => cat._id === product.idCategorie);
            const categoryName = category ? category.nomCat : 'Unknown';
            return (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.nom}</td>
                <td>{product.description}</td>
                <td>{product.prix}</td>
                <td>{product.Stock}</td>
                <td>{categoryName}</td>
                <td>
                  {product.photo ? (
                    <img
                    src={`http://localhost:3001${product.photo}`}
                      alt={product.nom}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No photo"
                  )}
                </td>
                <td>
                  <Button variant="success" onClick={() => handleShowEdit(product)}>
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleShowDelete(product._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Edit Product Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom de produit</Form.Label>
              <Form.Control
                type="text"
                value={editingProductData.nom}
                onChange={(e) =>
                  setEditingProductData({
                    ...editingProductData,
                    nom: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editingProductData.description}
                onChange={(e) =>
                  setEditingProductData({
                    ...editingProductData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="text"
                value={editingProductData.prix}
                onChange={(e) =>
                  setEditingProductData({
                    ...editingProductData,
                    prix: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                value={editingProductData.Stock}
                onChange={(e) =>
                  setEditingProductData({
                    ...editingProductData,
                    Stock: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Select
                value={editingProductData.idCategorie}
                onChange={(e) =>
                  setEditingProductData({
                    ...editingProductData,
                    idCategorie: e.target.value,
                  })
                }
              >
                <option value="">Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nomCat} 
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setEditingProductData({
                    ...editingProductData,
                    photo: file,
                  });
                }}
              />
              {editingProductData.photo && !(editingProductData.photo instanceof File) && (
                <img src={`http://localhost:3001${editingProductData.photo}`} alt="Product" style={{ width: "50px", height: "50px", marginTop: "10px" }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>Annuler</Button>
          <Button variant="success" onClick={handleEditProduct}>Modifier</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce produit ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>Annuler</Button>
          <Button variant="danger" onClick={handleDeleteProduct}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={toastShow} onClose={() => setToastShow(false)}>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ListeDeProduit;
