import { Product, Category } from '@shared/schema';

// We'll use our built-in fallback products for reliable performance.
// This ensures the app always works properly regardless of API availability.
// No external API needed since we've built a complete set of product data.

// This adapter uses a curated dataset of shoes with complete information
// No conversion needed from external API response format

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
 * Curated product dataset with high-quality images and complete information
 */
const productDataset: Product[] = [
  // Running Shoes
  {
    id: 101,
    name: "Nike Air Max 90",
    price: 129.99,
    description: "Iconic Air Max cushioning for all-day comfort",
    rating: 4.8,
    categoryId: 5, // Running
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 105,
    name: "New Balance 990",
    price: 174.99,
    description: "Premium made in USA running sneaker with ENCAP cushioning",
    rating: 4.7,
    categoryId: 5, // Running
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 110,
    name: "Asics Gel-Kayano",
    price: 159.99,
    description: "Premium stability running shoe with GEL cushioning",
    rating: 4.6,
    categoryId: 5, // Running
    imageUrl: "https://images.unsplash.com/photo-1562183241-b937e95585b6",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Casual Shoes
  {
    id: 102,
    name: "Adidas Superstar",
    price: 89.99,
    description: "Classic shell toe design with 3-stripe branding",
    rating: 4.7,
    categoryId: 1, // Casual
    imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 106,
    name: "Converse Chuck Taylor",
    price: 59.99,
    description: "Timeless canvas high top with rubber toe cap",
    rating: 4.5,
    categoryId: 1, // Casual
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 111,
    name: "Puma Suede Classic",
    price: 69.99,
    description: "Iconic suede upper with classic Formstrip design",
    rating: 4.4,
    categoryId: 1, // Casual
    imageUrl: "https://images.unsplash.com/photo-1554735490-5974588cbc4f",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Basketball Shoes
  {
    id: 103,
    name: "Jordan Retro 1",
    price: 169.99,
    description: "The original basketball sneaker that started it all",
    rating: 4.9,
    categoryId: 4, // Basketball
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 112,
    name: "Nike Kyrie 7",
    price: 129.99,
    description: "Lightweight, responsive basketball shoe for quick cuts",
    rating: 4.7,
    categoryId: 4, // Basketball
    imageUrl: "https://images.unsplash.com/photo-1579338559194-a162d19bf842",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 113,
    name: "Under Armour Curry 8",
    price: 159.99,
    description: "Signature basketball shoe with responsive cushioning",
    rating: 4.6,
    categoryId: 4, // Basketball
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Skate Shoes
  {
    id: 104,
    name: "Vans Old Skool",
    price: 69.99,
    description: "Classic skate shoe with signature side stripe",
    rating: 4.6,
    categoryId: 6, // Skate
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 114,
    name: "Nike SB Dunk Low",
    price: 100.99,
    description: "Iconic skate shoe with padded collar and Zoom Air unit",
    rating: 4.8,
    categoryId: 6, // Skate
    imageUrl: "https://images.unsplash.com/photo-1606890658317-7d14490b76fd",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Athletic Shoes
  {
    id: 115,
    name: "Nike Metcon 6",
    price: 129.99,
    description: "Versatile training shoe for gym workouts and lifting",
    rating: 4.5,
    categoryId: 2, // Athletic
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 116,
    name: "Adidas Ultraboost",
    price: 179.99,
    description: "Responsive Boost cushioning with Primeknit upper",
    rating: 4.8,
    categoryId: 2, // Athletic
    imageUrl: "https://images.unsplash.com/photo-1581977012607-4091712d36f9",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Limited Edition
  {
    id: 117,
    name: "Nike Dunk SB Travis Scott",
    price: 1299.99,
    description: "Limited edition collaboration with premium materials",
    rating: 4.9,
    categoryId: 3, // Limited Edition
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 118,
    name: "Adidas Yeezy Boost 350",
    price: 229.99,
    description: "Kanye West designed sneaker with Boost technology",
    rating: 4.7,
    categoryId: 3, // Limited Edition
    imageUrl: "https://images.unsplash.com/photo-1607893378714-007fd47c8719",
    modelUrl: "/models/default_sneaker.glb"
  },
  
  // Lifestyle
  {
    id: 119,
    name: "New Balance 327",
    price: 99.99,
    description: "Retro-inspired lifestyle shoe with bold design",
    rating: 4.4,
    categoryId: 7, // Lifestyle
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    modelUrl: "/models/default_sneaker.glb"
  },
  {
    id: 120,
    name: "Nike Air Force 1 '07",
    price: 89.99,
    description: "Timeless streetwear icon with premium leather upper",
    rating: 4.8,
    categoryId: 7, // Lifestyle
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    modelUrl: "/models/default_sneaker.glb"
  }
];

/**
 * Get products with optional category filter
 * Using our comprehensive product dataset for reliable performance
 */
export function getProducts(categoryId?: number): Promise<Product[]> {
  return new Promise((resolve) => {
    const filteredProducts = categoryId
      ? productDataset.filter((p: Product) => p.categoryId === categoryId)
      : productDataset;
    
    resolve(filteredProducts);
  });
}

/**
 * Search for products by keyword
 * Searches through name and description for the best matches
 */
export function searchProducts(query: string): Promise<Product[]> {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();
    // Search products by name and description 
    const filteredProducts = productDataset.filter((p: Product) => 
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
    // Return filtered results or all products if no matches
    resolve(filteredProducts.length > 0 ? filteredProducts : productDataset);
  });
}

/**
 * Get a specific product by ID
 * Returns the exact product from our product dataset
 */
export async function getProductById(id: number): Promise<Product | null> {
  const product = productDataset.find((p: Product) => p.id === id);
  return product || null;
}