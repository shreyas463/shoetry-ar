import { Product, Category } from '../types/schema';

// Base API URL
const API_URL = 'http://localhost:5000/api';

// Common fetch wrapper with error handling
const fetchAPI = async (endpoint: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Products API
export const getProducts = async (categoryId?: number): Promise<Product[]> => {
  const endpoint = categoryId ? `/products?categoryId=${categoryId}` : '/products';
  return fetchAPI(endpoint);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  return fetchAPI('/products?featured=true');
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  return fetchAPI(`/products/search?q=${encodeURIComponent(query)}`);
};

export const getProductById = async (id: number): Promise<Product> => {
  return fetchAPI(`/products/${id}`);
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  return fetchAPI('/categories');
};

// Favorites API
export const getFavorites = async (userId: number): Promise<Product[]> => {
  return fetchAPI(`/favorites?userId=${userId}`);
};

export const addFavorite = async (userId: number, productId: number): Promise<void> => {
  return fetchAPI('/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, productId }),
  });
};

export const removeFavorite = async (userId: number, productId: number): Promise<void> => {
  return fetchAPI(`/favorites/${productId}?userId=${userId}`, {
    method: 'DELETE',
  });
};

export const checkIsFavorite = async (userId: number, productId: number): Promise<boolean> => {
  try {
    const result = await fetchAPI(`/favorites/check?userId=${userId}&productId=${productId}`);
    return result.isFavorite;
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    return false;
  }
};