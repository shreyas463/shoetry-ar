import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";
import { getProducts, getProductById, searchProducts, sneakerCategories } from './sneaks-adapter';

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all categories - Using Sneaks API categories
  app.get("/api/categories", async (req, res) => {
    try {
      // Use sneaker categories instead of stored ones
      res.json(sneakerCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all products - Using Sneaks API
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      // Use real-time sneaker data instead of stored products
      const products = await getProducts(categoryId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products from Sneaks API" });
    }
  });

  // Get product by id - Using Sneaks API
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Use real-time sneaker data
      const product = await getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product from Sneaks API" });
    }
  });
  
  // Search products - Using Sneaks API
  app.get("/api/products/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      
      // Search for products using real-time sneaker data
      const products = await searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products from Sneaks API" });
    }
  });

  // Get favorites for a user
  app.get("/api/favorites", async (req, res) => {
    try {
      // For now, using a mock user ID since we don't have auth
      const userId = 1;
      const favorites = await storage.getFavoritesByUserId(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add product to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      // For now, using a mock user ID since we don't have auth
      const userId = 1;
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      const favorite = await storage.addFavorite(userId, parseInt(productId));
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  // Remove product from favorites
  app.delete("/api/favorites/:productId", async (req, res) => {
    try {
      // For now, using a mock user ID since we don't have auth
      const userId = 1;
      const productId = parseInt(req.params.productId);
      
      await storage.removeFavorite(userId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // We're now using real-time data from Sneaks API instead of demo data
  console.log("Using real-time sneaker data from Sneaks API");

  const httpServer = createServer(app);
  return httpServer;
}
