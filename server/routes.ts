import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { BlackCatAPI } from "./blackcat-api";
import { notifyUTMifyOrderCreated } from "./utmify-integration";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const reviews = await storage.getReviewsByProduct(id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = 'default-session';
      const cartItems = await storage.getCartItems(sessionId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const cartItems = await storage.getCartItems(sessionId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return { ...item, product };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { productId, quantity, weight, price, sessionId } = req.body;
      const finalSessionId = sessionId || 'default-session';
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const finalPrice = price || (weight === "1kg" ? product.price1kg : product.price500g);
      
      const cartItem = await storage.addToCart({
        sessionId: finalSessionId,
        productId,
        quantity,
        size: weight,
        price: finalPrice,
      });
      
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // CEP API removida a pedido do usuário

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Inicializar BlackCat API
      const blackCatAPI = new BlackCatAPI();
      
      // Buscar itens do carrinho
      const cartItems = await storage.getCartItems(orderData.sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Carrinho vazio" });
      }
      
      // Calcular total e preparar itens para BlackCat
      let totalAmount = 0;
      const blackCatItems = [];
      
      for (const cartItem of cartItems) {
        const product = await storage.getProductById(cartItem.productId);
        if (product) {
          const unitPrice = parseFloat(cartItem.price.replace(",", "."));
          const itemTotal = unitPrice * cartItem.quantity;
          totalAmount += itemTotal;
          
          blackCatItems.push({
            title: `${product.name} - ${cartItem.size}`,
            unitPrice: BlackCatAPI.convertToCents(unitPrice),
            quantity: cartItem.quantity,
            tangible: true
          });
        }
      }
      
      // Adicionar frete
      const shippingCost = 9.90;
      totalAmount += shippingCost;
      
      blackCatItems.push({
        title: "Frete",
        unitPrice: BlackCatAPI.convertToCents(shippingCost),
        quantity: 1,
        tangible: false
      });
      
      // Preparar dados para BlackCat
      const blackCatRequest = {
        amount: BlackCatAPI.convertToCents(totalAmount),
        paymentMethod: "pix" as const,
        pix: {
          expiresInDays: 3
        },
        items: blackCatItems,
        customer: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: BlackCatAPI.cleanPhone(orderData.customerPhone),
          document: {
            number: BlackCatAPI.cleanCPF(orderData.customerCpf),
            type: "cpf" as const
          }
        },
        externalRef: `TABUA-${Date.now()}`
      };
      
      // Criar transação PIX no BlackCat
      const pixTransaction = await blackCatAPI.createPixTransaction(blackCatRequest);
      
      // Salvar pedido no banco
      const order = await storage.createOrder({
        ...orderData,
        pixCode: pixTransaction.pix.qrcode,
        status: "pending",
        total: totalAmount.toFixed(2),
        blackCatTransactionId: pixTransaction.id.toString()
      });
      
      // Criar itens do pedido
      const orderItemsToAdd = [];
      for (const cartItem of cartItems) {
        const product = await storage.getProductById(cartItem.productId);
        if (product) {
          orderItemsToAdd.push({
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            size: cartItem.size || '500g'
          });
        }
      }
      
      if (orderItemsToAdd.length > 0) {
        await storage.addOrderItems(orderItemsToAdd);
      }
      
      // Enviar para UTMify (PIX gerado - waiting_payment)
      try {
        const orderItems = await storage.getOrderItems(order.id);
        const referer = req.get('referer');
        const userIP = req.ip || req.connection.remoteAddress;
        
        await notifyUTMifyOrderCreated(order, orderItems, referer, userIP);
        console.log(`UTMify notificado: Pedido ${order.id} criado`);
      } catch (utmifyError) {
        console.error('Erro ao notificar UTMify:', utmifyError);
        // Não falhar o pedido por erro do UTMify
      }
      
      // Limpar carrinho
      await storage.clearCart(orderData.sessionId);
      
      res.json({ 
        order: {
          ...order,
          blackCatTransactionId: pixTransaction.id
        }, 
        pixCode: pixTransaction.pix.qrcode,
        pixExpirationDate: pixTransaction.pix.expirationDate,
        paymentId: pixTransaction.id
      });
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar pedido. Tente novamente." });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Apply discount endpoint
  app.post("/api/apply-discount", async (req, res) => {
    try {
      const { sessionId, discountType } = req.body;
      
      // Mock discount application
      let discountPercentage = 0;
      if (discountType === "exit_intent") {
        discountPercentage = 10;
      } else if (discountType === "order_bump") {
        discountPercentage = 30;
      } else if (discountType === "upsell") {
        discountPercentage = 40;
      }
      
      res.json({ 
        success: true, 
        discountPercentage,
        message: `Desconto de ${discountPercentage}% aplicado com sucesso!`
      });
    } catch (error) {
      console.error("Error applying discount:", error);
      res.status(500).json({ message: "Failed to apply discount" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
