import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price500g: decimal("price_500g", { precision: 10, scale: 2 }).notNull(),
  price1kg: decimal("price_1kg", { precision: 10, scale: 2 }).notNull(),
  originalPrice500g: decimal("original_price_500g", { precision: 10, scale: 2 }),
  originalPrice1kg: decimal("original_price_1kg", { precision: 10, scale: 2 }),
  category: text("category").notNull(), // 'queijos', 'doces', 'combos'
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array(),
  weight: text("weight"),
  stock: integer("stock").default(100),
  featured: boolean("featured").default(false),
  discount: integer("discount").default(0), // percentage
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviews: integer("reviews").default(0),
  checkout500g: text("checkout_500g"),
  checkout1kg: text("checkout_1kg"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull().default("500g"), // "500g" or "1kg"
  price: text("price").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCpf: text("customer_cpf").notNull(),
  address: text("address").notNull(),
  addressNumber: text("address_number").notNull(),
  addressComplement: text("address_complement"),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // 'pending', 'paid', 'shipped', 'delivered'
  paymentMethod: text("payment_method").default("pix"),
  pixCode: text("pix_code"),
  blackCatTransactionId: text("blackcat_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull().default("0"),
  size: text("size").notNull().default("500g"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertProductReviewSchema = createInsertSchema(productReviews);

export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
