import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Get product reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const reviews = await storage.getProductReviews(id);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Failed to fetch product reviews" });
  }
});

export default router;