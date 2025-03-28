import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const products = await storage.getAllProducts(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by id
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
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

  // Initialize server with some demo data
  const initDemoData = async () => {
    try {
      // Check if we already have categories
      const existingCategories = await storage.getAllCategories();
      
      if (existingCategories.length === 0) {
        // Add demo categories
        const categories = [
          { name: "Running" },
          { name: "Casual" },
          { name: "Sport" },
          { name: "Hiking" },
          { name: "Fashion" }
        ];
        
        for (const category of categories) {
          await storage.createCategory(category);
        }
        
        // Add demo products
        const runningCategory = await storage.getCategoryByName("Running");
        const casualCategory = await storage.getCategoryByName("Casual");
        const sportCategory = await storage.getCategoryByName("Sport");
        const hikingCategory = await storage.getCategoryByName("Hiking");
        
        if (runningCategory && casualCategory && sportCategory && hikingCategory) {
          const products = [
            {
              name: "Air Cloud Runner",
              price: 129.99,
              description: "Lightweight running shoes with cloud-like comfort",
              rating: 4.8,
              categoryId: runningCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/air_cloud_runner.glb"
            },
            {
              name: "Urban Street Pro",
              price: 89.99,
              description: "Stylish casual shoes for everyday wear",
              rating: 4.6,
              categoryId: casualCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1584735175315-9d5df23be610?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/urban_street_pro.glb"
            },
            {
              name: "Flex Runner 2.0",
              price: 149.99,
              description: "High-performance running shoes with flex technology",
              rating: 4.9,
              categoryId: runningCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/flex_runner.glb"
            },
            {
              name: "Trail Blazer",
              price: 159.99,
              description: "Durable hiking shoes for rough terrain",
              rating: 4.7,
              categoryId: hikingCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/trail_blazer.glb"
            },
            {
              name: "Sport Max",
              price: 119.99,
              description: "Multi-purpose sports shoes with extra grip",
              rating: 4.5,
              categoryId: sportCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/sport_max.glb"
            },
            {
              name: "City Walker",
              price: 99.99,
              description: "Comfortable casual shoes for city exploration",
              rating: 4.4,
              categoryId: casualCategory.id,
              imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
              modelUrl: "/models/city_walker.glb"
            }
          ];
          
          for (const product of products) {
            await storage.createProduct(product);
          }
        }
      }
    } catch (error) {
      console.error("Failed to initialize demo data:", error);
    }
  };
  
  // Initialize demo data
  initDemoData();

  const httpServer = createServer(app);
  return httpServer;
}
