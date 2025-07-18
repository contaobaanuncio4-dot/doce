import type { Product, CartItem, Order, OrderItem, ProductReview, InsertProduct, InsertCartItem, InsertOrder, InsertOrderItem } from "@shared/schema";

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
  
  // Review operations
  getProductReviews(productId: number): Promise<ProductReview[]>;
  addProductReview(review: Omit<ProductReview, 'id' | 'createdAt'>): Promise<ProductReview>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, ProductReview>;
  private currentProductId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentReviewId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.currentProductId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentReviewId = 1;
    
    this.initializeProducts();
    this.initializeReviews();
  }

  private initializeProducts() {
    const sweetProducts: InsertProduct[] = [
      {
        name: "Doce 1",
        description: "Delicioso doce artesanal de Minas Gerais. Feito com ingredientes frescos e tradicionais da região, este doce carrega toda a tradição e sabor únicos que fazem de Minas um estado conhecido pela sua culinária excepcional.",
        price500g: "22.90",
        price1kg: "39.90",
        originalPrice500g: "28.90",
        originalPrice1kg: "49.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/screenshot_20250220_134158_gallery-f2481f2f6da2af43ca17400705957233-1024-1024.webp",
        stock: 25,
        featured: true,
        discount: 20,
        rating: "4.8",
        reviews: 127,
      },
      {
        name: "Doce 2", 
        description: "Doce tradicional mineiro com sabor inigualável. Produzido com técnicas artesanais passadas de geração em geração, este doce representa a verdadeira essência da culinária mineira, com ingredientes selecionados e muito amor no preparo.",
        price500g: "24.90",
        price1kg: "44.90",
        originalPrice500g: "29.90",
        originalPrice1kg: "54.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/screenshot_20250220_134201_gallery-0ced8af0fce1eb7b9017400711220608-1024-1024.webp",
        stock: 30,
        featured: true,
        discount: 15,
        rating: "4.9", 
        reviews: 89,
      },
      {
        name: "Doce 3",
        description: "Especialidade da casa com ingredientes selecionados. Um doce que representa a verdadeira essência de Minas, feito com receitas familiares guardadas há décadas e ingredientes da mais alta qualidade para proporcionar uma experiência gastronômica única.",
        price500g: "26.90",
        price1kg: "48.90",
        originalPrice500g: "32.90",
        originalPrice1kg: "58.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/screenshot_20250220_134149_gallery-24144f6cfc3a3f84f917400705607850-1024-1024.webp",
        stock: 20,
        featured: true,
        discount: 18,
        rating: "5.0",
        reviews: 156,
      },
      {
        name: "Doce 4",
        description: "Doce cremoso e saboroso, ideal para toda a família. Feito com muito carinho e tradição mineira, este doce conquista pelo sabor marcante e textura perfeita. Uma verdadeira viagem às origens da doçaria artesanal de Minas Gerais.",
        price500g: "21.90",
        price1kg: "38.90",
        originalPrice500g: "26.90",
        originalPrice1kg: "46.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/20250226_153746-eaaf1cab9d70d1b92a17405957512697-1024-1024.webp",
        stock: 35,
        featured: false,
        discount: 20,
        rating: "4.7",
        reviews: 73,
      },
      {
        name: "Doce 5",
        description: "Receita especial da Tábua de Minas. Um doce que carrega a história e o sabor autêntico da região, preparado com ingredientes naturais e técnicas tradicionais que preservam todo o sabor e qualidade que tornaram Minas famosa pela sua doçaria.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: "34.90",
        originalPrice1kg: "62.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/screenshot_20250220_134203_gallery-ceb3bfbce301401ec417400715674870-1024-1024.webp",
        stock: 15,
        featured: true,
        discount: 17,
        rating: "4.9",
        reviews: 92,
      },
      {
        name: "Doce 6",
        description: "Doce artesanal premium com textura única. Uma experiência gastronômica inesquecível que combina tradição e inovação, oferecendo sabores que remetem à infância e à mesa da vovó, com a qualidade e apresentação de um produto gourmet.",
        price500g: "25.90",
        price1kg: "46.90",
        originalPrice500g: "30.90",
        originalPrice1kg: "55.90",
        category: "doces",
        imageUrl: "https://acdn-us.mitiendanube.com/stores/003/650/403/products/1000440122-83b1fec983ebf014fc17436208923246-1024-1024.webp",
        stock: 22,
        featured: false,
        discount: 16,
        rating: "4.8",
        reviews: 64,
      }
    ];

    sweetProducts.forEach(product => {
      const newProduct: Product = {
        ...product,
        id: this.currentProductId++,
        createdAt: new Date(),
      };
      this.products.set(newProduct.id, newProduct);
    });
  }

  private initializeReviews() {
    const sampleReviews = [
      { productId: 1, customerName: "Maria Silva", rating: 5, comment: "Produto excelente! Sabor autêntico e entrega rápida." },
      { productId: 1, customerName: "João Santos", rating: 4, comment: "Muito bom, recomendo. Lembra o doce da minha avó." },
      { productId: 2, customerName: "Ana Costa", rating: 5, comment: "Simplesmente perfeito! A qualidade é excepcional." },
      { productId: 3, customerName: "Carlos Mendes", rating: 5, comment: "O melhor doce que já provei. Super recomendo!" },
    ];

    sampleReviews.forEach(review => {
      const newReview: ProductReview = {
        ...review,
        id: this.currentReviewId++,
        createdAt: new Date(),
      };
      this.reviews.set(newReview.id, newReview);
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

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.currentProductId++,
      createdAt: new Date(),
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
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

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const newItem: CartItem = {
      ...item,
      id: this.currentCartId++,
      createdAt: new Date(),
    };
    this.cartItems.set(newItem.id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = await this.getCartItems(sessionId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.currentOrderId++,
      createdAt: new Date(),
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const newOrderItem: OrderItem = {
      ...orderItem,
      id: this.currentOrderItemId++,
      createdAt: new Date(),
    };
    this.orderItems.set(newOrderItem.id, newOrderItem);
    return newOrderItem;
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
    
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // Review operations
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }

  async addProductReview(review: Omit<ProductReview, 'id' | 'createdAt'>): Promise<ProductReview> {
    const newReview: ProductReview = {
      ...review,
      id: this.currentReviewId++,
      createdAt: new Date(),
    };
    this.reviews.set(newReview.id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();