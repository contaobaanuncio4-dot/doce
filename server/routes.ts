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

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      
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
      
      // Salvar itens do pedido
      for (const cartItem of cartItems) {
        const product = await storage.getProductById(cartItem.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            size: cartItem.size
          });
        }
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