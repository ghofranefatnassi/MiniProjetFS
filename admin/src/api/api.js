import axios from "axios";

const API_URL = "http://localhost:3001/api/users"; // Your back-end URL
const API_URLS = "http://localhost:3001/api";
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login-user`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URLS}/categories`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const addCategory = async (category) => {
  try {
    const response = await axios.post(`${API_URLS}/categories/ajouter`, category);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCategory = async (id, updatedData) => {
  try {
    const response = await axios.patch(`${API_URLS}/categories/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URLS}/categories/${id}`);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URLS}/produits/ajouter`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
