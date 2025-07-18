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
        name: "Doce de Leite Tradicional",
        description: "Autêntico doce de leite cremoso, feito com leite fresco da fazenda e açúcar cristal. Tradição mineira em cada colherada.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: "35.90",
        originalPrice1kg: "65.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/reeerererer_520x.png?v=1751488897",
        stock: 25,
        featured: true,
        discount: 20,
        rating: "4.9",
        reviews: 187,
      },
      {
        name: "Kit 4 Queijos Artesanais",
        description: "Seleção especial com 4 tipos de queijos artesanais mineiros: mussarela, prato, minas padrão e coalho.",
        price500g: "45.90",
        price1kg: "85.90",
        originalPrice500g: "55.90",
        originalPrice1kg: "105.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/kit4queijos_160x.png?v=1751561960",
        stock: 15,
        featured: true,
        discount: 18,
        rating: "4.8",
        reviews: 156,
      },
      {
        name: "Queijo Minas Artesanal",
        description: "Queijo minas artesanal da Serra da Canastra, com sabor marcante e textura cremosa. Certificado de origem.",
        price500g: "35.90",
        price1kg: "65.90",
        originalPrice500g: "42.90",
        originalPrice1kg: "79.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/taq_400x.png?v=1751478341",
        stock: 20,
        featured: true,
        discount: 16,
        rating: "4.9",
        reviews: 203,
      },
      {
        name: "Doce de Abacaxi",
        description: "Doce cremoso de abacaxi com pedacinhos da fruta, preparado com abacaxis selecionados e açúcar demerara.",
        price500g: "26.90",
        price1kg: "48.90",
        originalPrice500g: "32.90",
        originalPrice1kg: "58.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/abacaxi_400x.png?v=1751475432",
        stock: 30,
        featured: false,
        discount: 18,
        rating: "4.7",
        reviews: 124,
      },
      {
        name: "Doce de Romã com Mel",
        description: "Combinação única de romã fresca com mel de abelhas, criando um doce com sabor exótico e propriedades antioxidantes.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: "39.90",
        originalPrice1kg: "72.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/rpomei_400x.png?v=1751314611",
        stock: 18,
        featured: true,
        discount: 18,
        rating: "4.8",
        reviews: 89,
      },
      {
        name: "Doce de Maracujá",
        description: "Doce cremoso de maracujá com a acidez perfeita, feito com polpa natural da fruta. Sabor tropical irresistível.",
        price500g: "29.90",
        price1kg: "54.90",
        originalPrice500g: "36.90",
        originalPrice1kg: "67.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/maracuja_400x.png?v=1751475750",
        stock: 25,
        featured: true,
        discount: 19,
        rating: "4.9",
        reviews: 167,
      },
      {
        name: "Queijo Coalho Defumado",
        description: "Queijo coalho artesanal defumado com madeira de aroeira, conferindo sabor único e aroma marcante.",
        price500g: "38.90",
        price1kg: "72.90",
        originalPrice500g: "45.90",
        originalPrice1kg: "85.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/xaaf_400x.png?v=1751314094",
        stock: 12,
        featured: false,
        discount: 15,
        rating: "4.7",
        reviews: 98,
      },
      {
        name: "Requeijão Cremoso",
        description: "Requeijão cremoso artesanal, perfeito para passar no pão ou usar em receitas. Textura aveludada e sabor suave.",
        price500g: "24.90",
        price1kg: "45.90",
        originalPrice500g: "29.90",
        originalPrice1kg: "55.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/adssdasd_400x.png?v=1751314259",
        stock: 35,
        featured: false,
        discount: 17,
        rating: "4.6",
        reviews: 142,
      },
      {
        name: "Doce de Figo",
        description: "Doce tradicional de figo roxo, preparado com figos maduros selecionados e açúcar cristal. Receita da família.",
        price500g: "31.90",
        price1kg: "58.90",
        originalPrice500g: "38.90",
        originalPrice1kg: "71.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/a1_400x.png?v=1751314696",
        stock: 20,
        featured: false,
        discount: 18,
        rating: "4.8",
        reviews: 113,
      },
      {
        name: "Goiabada Cascão",
        description: "Goiabada cascão tradicional, com pedaços de goiaba e textura firme. Perfeita para comer com queijo minas.",
        price500g: "25.90",
        price1kg: "47.90",
        originalPrice500g: "31.90",
        originalPrice1kg: "57.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/36_400x.png?v=1751313980",
        stock: 40,
        featured: true,
        discount: 19,
        rating: "4.9",
        reviews: 234,
      },
      {
        name: "Doce de Banana",
        description: "Doce cremoso de banana nanica, com textura suave e sabor intenso. Feito com bananas maduras selecionadas.",
        price500g: "23.90",
        price1kg: "43.90",
        originalPrice500g: "28.90",
        originalPrice1kg: "52.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_400x.png?v=1751475618",
        stock: 28,
        featured: false,
        discount: 17,
        rating: "4.7",
        reviews: 156,
      },
      {
        name: "Marmelada Artesanal",
        description: "Marmelada de marmelos selecionados, com cor dourada e sabor marcante. Tradição portuguesa adaptada ao paladar mineiro.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: "34.90",
        originalPrice1kg: "63.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/14_400x.png?v=1751314396",
        stock: 22,
        featured: false,
        discount: 17,
        rating: "4.6",
        reviews: 87,
      },
      {
        name: "Geleia Mista",
        description: "Geleia especial com mix de frutas vermelhas: morango, framboesa e amora. Sabor equilibrado e cor vibrante.",
        price500g: "27.90",
        price1kg: "50.90",
        originalPrice500g: "33.90",
        originalPrice1kg: "61.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/jm_200x.png?v=1751313324",
        stock: 25,
        featured: true,
        discount: 18,
        rating: "4.8",
        reviews: 176,
      },
      {
        name: "Doce de Coco",
        description: "Doce de coco ralado fresco com leite condensado, preparado artesanalmente. Textura cremosa e sabor tropical.",
        price500g: "26.90",
        price1kg: "48.90",
        originalPrice500g: "32.90",
        originalPrice1kg: "58.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_e78d3b4d-266f-41ae-8503-aabffb46288c_200x.png?v=1751605312",
        stock: 30,
        featured: false,
        discount: 18,
        rating: "4.7",
        reviews: 134,
      },
      {
        name: "Queijo da Serra",
        description: "Queijo artesanal da Serra da Mantiqueira, maturado naturalmente. Sabor intenso e textura única.",
        price500g: "42.90",
        price1kg: "79.90",
        originalPrice500g: "52.90",
        originalPrice1kg: "95.90",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/dasantacerto_200x.png?v=1751560720",
        stock: 8,
        featured: true,
        discount: 19,
        rating: "4.9",
        reviews: 92,
      },
      {
        name: "Quebra Queixo",
        description: "Doce tradicional mineiro extremamente duro, feito com rapadura e amendoim. Desafio para os dentes!",
        price500g: "22.90",
        price1kg: "41.90",
        originalPrice500g: "27.90",
        originalPrice1kg: "49.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/quebra_pica_400x.png?v=1751477963",
        stock: 35,
        featured: false,
        discount: 18,
        rating: "4.5",
        reviews: 78,
      },
      {
        name: "Doce de Mamão",
        description: "Doce cristalizado de mamão verde, com calda especial de açúcar e especiarias. Tradição das casas mineiras.",
        price500g: "24.90",
        price1kg: "45.90",
        originalPrice500g: "29.90",
        originalPrice1kg: "55.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/ramy_400x.png?v=1751476903",
        stock: 20,
        featured: false,
        discount: 17,
        rating: "4.6",
        reviews: 101,
      },
      {
        name: "Doce de Leite com Coco",
        description: "Combinação perfeita de doce de leite cremoso com coco ralado fresco. Sabores que se complementam harmoniosamente.",
        price500g: "30.90",
        price1kg: "56.90",
        originalPrice500g: "37.90",
        originalPrice1kg: "68.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/uauaua_400x.png?v=1751314805",
        stock: 22,
        featured: true,
        discount: 18,
        rating: "4.8",
        reviews: 189,
      },
      {
        name: "Geleia de Amora",
        description: "Geleia pura de amora silvestre, com sementes que proporcionam textura especial. Colhida na época certa para máximo sabor.",
        price500g: "29.90",
        price1kg: "54.90",
        originalPrice500g: "35.90",
        originalPrice1kg: "65.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/seese_400x.png?v=1751316108",
        stock: 18,
        featured: false,
        discount: 17,
        rating: "4.7",
        reviews: 112,
      },
      {
        name: "Doce de Pêssego",
        description: "Doce em calda de pêssegos maduros, com pedaços da fruta preservando sua textura original. Sabor delicado e refrescante.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: "34.90",
        originalPrice1kg: "63.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_209aea42-f25e-4555-aa99-9cb418bf28c0_400x.png?v=1751475256",
        stock: 24,
        featured: false,
        discount: 17,
        rating: "4.6",
        reviews: 95,
      },
      {
        name: "Doce de Jabuticaba",
        description: "Doce raro de jabuticaba, fruta típica brasileira com sabor único. Feito com frutas frescas colhidas no ponto ideal.",
        price500g: "35.90",
        price1kg: "65.90",
        originalPrice500g: "42.90",
        originalPrice1kg: "78.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/jauja_400x.png?v=1751314881",
        stock: 12,
        featured: true,
        discount: 16,
        rating: "4.9",
        reviews: 67,
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