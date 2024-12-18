import axios from 'axios';

// L'URL de l'API backend
const API_URL = 'http://localhost:3001/api/produits'; 

// Fonction pour récupérer tous les produits

export const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
// Fonction pour rechercher un produit par son nom
export const searchProducts = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/search?nom=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des produits:', error);
    return [];
  }
};

export const fetchProductsByCategory = (idCategorie) => async (dispatch) => {
    try {
      dispatch({ type: 'PRODUCTS_REQUEST' });
      const { data } = await axios.get(`http://localhost:3001/api/produits/category/${idCategorie}`);
      dispatch({ type: 'PRODUCTS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'PRODUCTS_FAIL',
        payload: error.response?.data || error.message,
      });
    }
  };