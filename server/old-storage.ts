import { 
  products, 
  cartItems, 
  orders, 
  orderItems,
  type Product, 
  type CartItem, 
  type Order, 
  type OrderItem,
  type InsertProduct,
  type InsertCartItem,
  type InsertOrder,
  type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersBySessionId(sessionId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Queijo Minas Tradicional",
        description: "Queijo artesanal curado por 60 dias, sabor marcante e textura cremosa",
        price: "38.25",
        category: "queijos",
        imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 50,
        featured: true,
        discount: 15,
        rating: "4.9",
        reviews: 127,
        weight: "300g"
      },
      {
        name: "Doce de Leite Caseiro",
        description: "Doce de leite artesanal feito com leite fresco e açúcar cristal",
        price: "28.90",
        category: "doces",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 30,
        featured: true,
        discount: 0,
        rating: "5.0",
        reviews: 203,
        weight: "500g"
      },
      {
        name: "Combo Tradição Mineira",
        description: "Queijo, doce de leite, goiabada e biscoito de polvilho",
        price: "89.90",
        category: "combos",
        imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 25,
        featured: true,
        discount: 25,
        rating: "4.8",
        reviews: 89,
        weight: "1.2kg"
      },
      {
        name: "Goiabada Artesanal",
        description: "Goiabada tradicional feita com goiaba selecionada",
        price: "24.90",
        category: "doces",
        imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 40,
        featured: false,
        discount: 0,
        rating: "4.7",
        reviews: 156,
        weight: "400g"
      },
      {
        name: "Queijo Pão de Açúcar",
        description: "Queijo curado especial com sabor intenso e marcante",
        price: "52.90",
        category: "queijos",
        imageUrl: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 20,
        featured: false,
        discount: 0,
        rating: "4.9",
        reviews: 74,
        weight: "300g"
      },
      {
        name: "Beijinho Tradicional",
        description: "Docinhos tradicionais feitos com coco e leite condensado",
        price: "32.90",
        category: "doces",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 35,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 92,
        weight: "12 unidades"
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      stock: insertProduct.stock ?? 100,
      featured: insertProduct.featured ?? false,
      discount: insertProduct.discount ?? 0,
      rating: insertProduct.rating ?? "5.0",
      reviews: insertProduct.reviews ?? 0,
      weight: insertProduct.weight ?? null,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartId++;
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      total: insertOrder.total,
      discount: insertOrder.discount ?? "0",
      status: insertOrder.status ?? "pending",
      paymentMethod: insertOrder.paymentMethod ?? "pix",
      pixCode: insertOrder.pixCode ?? null,
      customerCpf: insertOrder.customerCpf ?? null,
      addressComplement: insertOrder.addressComplement ?? null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id,
      createdAt: new Date()
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersBySessionId(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.sessionId === sessionId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
