export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  modelUrl?: string;
  categoryId: number;
  brand: string;
  inStock: boolean;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
}