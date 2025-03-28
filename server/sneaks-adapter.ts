import SneaksAPI from 'sneaks-api';
import { Product, Category } from '@shared/schema';

// Initialize the Sneaks API
const sneaks = new SneaksAPI();

/**
 * Convert a sneaker object from the API to our Product type
 */
function convertSneakerToProduct(sneaker: any, categoryId: number): Product {
  return {
    id: parseInt(sneaker.styleID) || Math.floor(Math.random() * 1000000),
    name: sneaker.shoeName || 'Unknown Sneaker',
    price: parseFloat(sneaker.retailPrice) || 99.99,
    description: sneaker.description || 'Trendy sneakers for your collection',
    rating: parseFloat(sneaker.rating) || 4.5,
    categoryId: categoryId,
    imageUrl: sneaker.thumbnail || sneaker.imageLinks[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    modelUrl: '/models/default_sneaker.glb' // Default 3D model
  };
}

/**
 * Pre-defined categories for sneakers
 */
export const sneakerCategories: Category[] = [
  { id: 1, name: "Casual" },
  { id: 2, name: "Athletic" },
  { id: 3, name: "Limited Edition" },
  { id: 4, name: "Basketball" },
  { id: 5, name: "Running" },
  { id: 6, name: "Skate" },
  { id: 7, name: "Lifestyle" }
];

/**
 * Get products with optional category filter
 */
export function getProducts(categoryId?: number): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    sneaks.getMostPopular((err: Error, products: any[]) => {
      if (err) {
        console.error('Error getting products from Sneaks API:', err);
        reject(err);
        return;
      }
      
      // Convert sneaker objects to our Product type
      const convertedProducts = products.map(sneaker => {
        // Assign a random category if none specified
        const assignedCategoryId = categoryId || 
          sneakerCategories[Math.floor(Math.random() * sneakerCategories.length)].id;
        
        return convertSneakerToProduct(sneaker, assignedCategoryId);
      });
      
      // Filter by category if specified
      const filteredProducts = categoryId 
        ? convertedProducts.filter(product => product.categoryId === categoryId)
        : convertedProducts;
      
      resolve(filteredProducts);
    });
  });
}

/**
 * Search for products by keyword
 */
export function searchProducts(query: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    sneaks.getProducts(query, 10, (err: Error, products: any[]) => {
      if (err) {
        console.error('Error searching products from Sneaks API:', err);
        reject(err);
        return;
      }
      
      // Convert sneaker objects to our Product type
      const convertedProducts = products.map(sneaker => {
        // Assign a random category
        const randomCategoryId = sneakerCategories[Math.floor(Math.random() * sneakerCategories.length)].id;
        
        return convertSneakerToProduct(sneaker, randomCategoryId);
      });
      
      resolve(convertedProducts);
    });
  });
}

/**
 * Get a specific product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    // Since the Sneaks API doesn't have a direct getById method,
    // we'll fetch all products and find the matching one
    const allProducts = await getProducts();
    const product = allProducts.find(p => p.id === id);
    
    return product || null;
  } catch (error) {
    console.error('Error getting product by ID from Sneaks API:', error);
    throw error;
  }
}