import { 
  users, 
  type User, 
  type InsertUser, 
  categories, 
  type Category, 
  type InsertCategory, 
  products, 
  type Product, 
  type InsertProduct, 
  favorites, 
  type Favorite, 
  type InsertFavorite 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getAllProducts(categoryId?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Favorite methods
  getFavoritesByUserId(userId: number): Promise<Product[]>;
  addFavorite(userId: number, productId: number): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<void>;
  isFavorite(userId: number, productId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private favorites: Map<number, Favorite>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.favorites = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.favoriteIdCounter = 1;
    
    // Add a demo user
    this.createUser({
      username: "demouser",
      password: "password"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getAllProducts(categoryId?: number): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    
    if (categoryId !== undefined) {
      return allProducts.filter(product => product.categoryId === categoryId);
    }
    
    return allProducts;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Favorite methods
  async getFavoritesByUserId(userId: number): Promise<Product[]> {
    const userFavorites = Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId);
    
    const favoriteProducts: Product[] = [];
    
    for (const favorite of userFavorites) {
      const product = this.products.get(favorite.productId);
      if (product) {
        favoriteProducts.push(product);
      }
    }
    
    return favoriteProducts;
  }
  
  async addFavorite(userId: number, productId: number): Promise<Favorite> {
    // Check if already a favorite
    const existing = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.productId === productId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { id, userId, productId };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, productId: number): Promise<void> {
    const favoriteToRemove = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.productId === productId
    );
    
    if (favoriteToRemove) {
      this.favorites.delete(favoriteToRemove.id);
    }
  }
  
  async isFavorite(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(
      f => f.userId === userId && f.productId === productId
    );
  }
}

export const storage = new MemStorage();
