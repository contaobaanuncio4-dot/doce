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
        name: "Doce de Cocada com Abacaxi",
        description: "Deliciosa cocada artesanal com pedaços frescos de abacaxi. Uma combinação tropical irresistível que une o sabor cremoso do coco com a doçura refrescante do abacaxi.",
        price500g: "34.90",
        price1kg: "38.39",
        originalPrice500g: "60.90",
        originalPrice1kg: "66.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/kit4queijos_160x.png?v=1751561960",
        stock: 15,
        featured: true,
        discount: 43,
        rating: "4.8",
        reviews: 156,
      },
      {
        name: "Doce Prestígio Mineiro",
        description: "Inspirado no famoso doce brasileiro, nossa versão artesanal combina coco fresco com cobertura de chocolate. Uma explosão de sabores que remete à infância.",
        price500g: "33.90",
        price1kg: "37.29",
        originalPrice500g: "46.00",
        originalPrice1kg: "50.60",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/taq_400x.png?v=1751478341",
        stock: 20,
        featured: true,
        discount: 26,
        rating: "4.9",
        reviews: 203,
      },
      {
        name: "Doce de Cocada com Maracujá",
        description: "Cocada especial com o toque ácido e aromático do maracujá. A combinação perfeita entre o doce do coco e a acidez tropical da fruta da paixão.",
        price500g: "24.90",
        price1kg: "27.39",
        originalPrice500g: "41.90",
        originalPrice1kg: "46.09",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/abacaxi_400x.png?v=1751475432",
        stock: 30,
        featured: false,
        discount: 41,
        rating: "4.7",
        reviews: 124,
      },
      {
        name: "Doce Casadinho",
        description: "Tradicional doce mineiro que combina dois sabores em perfeita harmonia. Uma metade de doce de leite e outra de goiabada, unidos em uma única delícia.",
        price500g: "32.90",
        price1kg: "36.19",
        originalPrice500g: "43.90",
        originalPrice1kg: "48.29",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/rpomei_400x.png?v=1751314611",
        stock: 18,
        featured: true,
        discount: 25,
        rating: "4.8",
        reviews: 89,
      },
      {
        name: "Doce de Leite",
        description: "Clássico doce de leite artesanal, preparado lentamente para atingir a consistência e sabor perfeitos. O verdadeiro sabor da tradição mineira.",
        price500g: "22.90",
        price1kg: "25.19",
        originalPrice500g: "40.00",
        originalPrice1kg: "44.00",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/maracuja_400x.png?v=1751475750",
        stock: 25,
        featured: true,
        discount: 43,
        rating: "4.9",
        reviews: 167,
      },
      {
        name: "Doce de Leite com Café",
        description: "Inovadora combinação do tradicional doce de leite com o aroma intenso do café mineiro. Para os amantes de sabores marcantes e únicos.",
        price500g: "26.90",
        price1kg: "29.59",
        originalPrice500g: "45.00",
        originalPrice1kg: "49.50",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/xaaf_400x.png?v=1751314094",
        stock: 12,
        featured: false,
        discount: 40,
        rating: "4.7",
        reviews: 98,
      },
      {
        name: "Doce de Pingo de Leite com Amendoim",
        description: "Receita especial que combina o cremoso pingo de leite com amendoim crocante. Uma textura única que derrete na boca com explosões de sabor.",
        price500g: "58.90",
        price1kg: "64.79",
        originalPrice500g: "80.90",
        originalPrice1kg: "88.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/adssdasd_400x.png?v=1751314259",
        stock: 35,
        featured: false,
        discount: 27,
        rating: "4.6",
        reviews: 142,
      },
      {
        name: "Doce de Cocada com Ameixa",
        description: "Sofisticada cocada que incorpora ameixas selecionadas, criando um contraste perfeito entre o doce do coco e a suavidade da fruta.",
        price500g: "32.90",
        price1kg: "36.19",
        originalPrice500g: "43.90",
        originalPrice1kg: "48.29",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/a1_400x.png?v=1751314696",
        stock: 20,
        featured: false,
        discount: 25,
        rating: "4.8",
        reviews: 113,
      },
      {
        name: "Doce de Abóbora com Coco",
        description: "Combinação única de abóbora doce com coco ralado fresco. Um doce nutritivo e saboroso que une tradição e inovação culinária.",
        price500g: "27.90",
        price1kg: "30.69",
        originalPrice500g: "44.00",
        originalPrice1kg: "48.40",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/36_400x.png?v=1751313980",
        stock: 40,
        featured: true,
        discount: 37,
        rating: "4.9",
        reviews: 234,
      },
      {
        name: "Doce Quebra-Queixo",
        description: "Tradicional doce mineiro de consistência extremamente dura, feito com rapadura pura e amendoim. Um verdadeiro desafio que testa a resistência dos dentes!",
        price500g: "36.90",
        price1kg: "40.59",
        originalPrice500g: "60.90",
        originalPrice1kg: "66.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_400x.png?v=1751475618",
        stock: 28,
        featured: false,
        discount: 39,
        rating: "4.7",
        reviews: 156,
      },
      {
        name: "Figo Ramy",
        description: "Figos especiais da variedade Ramy, cristalizados com açúcar e especiarias. Uma iguaria refinada com sabor adocicado e textura única.",
        price500g: "39.90",
        price1kg: "43.89",
        originalPrice500g: "60.90",
        originalPrice1kg: "66.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/14_400x.png?v=1751314396",
        stock: 22,
        featured: false,
        discount: 34,
        rating: "4.6",
        reviews: 87,
      },
      {
        name: "Doce de Goiabada Cascão",
        description: "Tradicional goiabada cascão com textura firme e sabor intenso de goiaba. Perfeita para acompanhar queijo minas ou saborear pura.",
        price500g: "24.90",
        price1kg: "27.39",
        originalPrice500g: "40.00",
        originalPrice1kg: "44.00",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/jm_200x.png?v=1751313324",
        stock: 25,
        featured: true,
        discount: 38,
        rating: "4.8",
        reviews: 176,
      },
      {
        name: "Doce de Goiabada Cascão São Gonçalo",
        description: "Versão especial da tradicional goiabada cascão, produzida com goiabas da região de São Gonçalo. Sabor autêntico e qualidade superior.",
        price500g: "24.90",
        price1kg: "27.39",
        originalPrice500g: "31.90",
        originalPrice1kg: "35.09",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_e78d3b4d-266f-41ae-8503-aabffb46288c_200x.png?v=1751605312",
        stock: 30,
        featured: false,
        discount: 22,
        rating: "4.7",
        reviews: 134,
      },
      {
        name: "Bananada São Gonçalo",
        description: "Doce tradicional de banana da região de São Gonçalo, com textura cremosa e sabor intenso. Feito com bananas maduras selecionadas e açúcar cristal.",
        price500g: "34.90",
        price1kg: "38.39",
        originalPrice500g: "80.90",
        originalPrice1kg: "88.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/dasantacerto_200x.png?v=1751560720",
        stock: 8,
        featured: true,
        discount: 57,
        rating: "4.9",
        reviews: 92,
      },
      {
        name: "Doce de Banana Zero Açúcar",
        description: "Versão saudável do tradicional doce de banana, adoçado naturalmente sem adição de açúcar refinado. Ideal para quem busca sabor sem abrir mão da saúde.",
        price500g: "58.90",
        price1kg: "64.79",
        originalPrice500g: "80.90",
        originalPrice1kg: "88.99",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/quebra_pica_400x.png?v=1751477963",
        stock: 35,
        featured: false,
        discount: 27,
        rating: "4.5",
        reviews: 78,
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