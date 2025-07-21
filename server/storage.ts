import {
  type Product,
  type CartItem,
  type Order,
  type OrderItem,
  type ProductReview,
  type InsertCartItem,
  type InsertOrder,
  type InsertOrderItem,
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductReviews(productId: number): Promise<ProductReview[]>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, updates: Partial<CartItem>): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order item operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

class MemoryStorage implements IStorage {
  private products: Product[] = [];
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private reviews: ProductReview[] = [];

  constructor() {
    this.initializeProducts();
    this.initializeReviews();
  }

  private initializeProducts() {
    // Produtos básicos com as informações dos queijos linha premium
    const initialProducts = [
      {
        id: 1,
        name: "Queijo MinasBri",
        description: "Queijo tipo Brie artesanal, cremoso e de sabor suave. Produzido com leite fresco das montanhas de Minas Gerais seguindo técnicas tradicionais francesas.",
        price500g: "33.90",
        price1kg: "33.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892"],
        weight: "250g",
        stock: 15,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 92,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Kit 4 Queijos de Alagoa-MG (parmesão)",
        description: "Kit especial com 4 queijos artesanais tipo parmesão de Alagoa, Minas Gerais. Perfeito para degustação e presente para amantes de queijo.",
        price500g: "53.90",
        price1kg: "53.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960"],
        weight: "Kit 4 unidades",
        stock: 8,
        featured: true,
        discount: 15,
        rating: "4.9",
        reviews: 65,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Queijo Canastra Meia Cura 1kg/1,2kg",
        description: "Queijo Canastra tradicional com meia cura, sabor marcante e textura firme. Direto da Serra da Canastra, região patrimônio da humanidade.",
        price500g: "69.00",
        price1kg: "69.00",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/4_300x.png?v=1751312328",
        imageUrls: [
          "https://tabuademinas.com/cdn/shop/files/4_300x.png?v=1751312328",
          "https://tabuademinas.com/cdn/shop/files/5_300x.png?v=1751312328"
        ],
        weight: "1kg/1,2kg",
        stock: 12,
        featured: true,
        discount: 10,
        rating: "4.9",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Doce Prestígio Mineiro",
        description: "Inspirado no famoso doce brasileiro, nossa versão artesanal combina coco fresco com cobertura de chocolate. Uma explosão de sabores que remete à infância.",
        price500g: "24.90",
        price1kg: "40.29",
        originalPrice500g: "46.00",
        originalPrice1kg: "50.60",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/rpomei_300x.png?v=1751314611",
        stock: 20,
        featured: true,
        discount: 26,
        rating: "4.9",
        reviews: 203,
        createdAt: new Date(),
      }
    ];

    this.products = initialProducts;
  }

  private initializeReviews() {
    const mockReviews = [
      {
        id: 1,
        productId: 1,
        customerName: "Maria Silva",
        rating: 5,
        comment: "Queijo excelente! Muito cremoso e saboroso.",
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: 2,
        productId: 1,
        customerName: "João Santos",
        rating: 4,
        comment: "Muito bom, lembra os queijos franceses.",
        createdAt: new Date("2024-01-10").toISOString(),
      },
      {
        id: 3,
        productId: 2,
        customerName: "Ana Costa",
        rating: 5,
        comment: "Kit perfeito para degustação! Todos os queijos são deliciosos.",
        createdAt: new Date("2024-01-20").toISOString(),
      },
    ];

    this.reviews = mockReviews;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter(p => p.featured);
  }

  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return this.cartItems.filter(item => item.sessionId === sessionId);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const existingItem = this.cartItems.find(
      item => 
        item.sessionId === cartItem.sessionId && 
        item.productId === cartItem.productId &&
        item.size === cartItem.size
    );

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
      return existingItem;
    }

    const newItem: CartItem = {
      ...cartItem,
      id: this.cartItems.length + 1,
      createdAt: new Date(),
    };

    this.cartItems.push(newItem);
    return newItem;
  }

  async updateCartItem(id: number, updates: Partial<CartItem>): Promise<CartItem | undefined> {
    const index = this.cartItems.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    this.cartItems[index] = { ...this.cartItems[index], ...updates };
    return this.cartItems[index];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const index = this.cartItems.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.cartItems.splice(index, 1);
    return true;
  }

  async clearCart(sessionId: string): Promise<void> {
    this.cartItems = this.cartItems.filter(item => item.sessionId !== sessionId);
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.orders.length + 1,
      createdAt: new Date(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return this.orders.filter(o => o.sessionId === sessionId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;

    this.orders[index].status = status;
    return this.orders[index];
  }

  // Order item operations
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const newOrderItem: OrderItem = {
      ...orderItem,
      id: this.orderItems.length + 1,
      createdAt: new Date(),
    };

    this.orderItems.push(newOrderItem);
    return newOrderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.filter(item => item.orderId === orderId);
  }
}

export const storage = new MemoryStorage();