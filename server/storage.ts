import {
  type Product,
  type CartItem,
  type Order,
  type OrderItem,
  type ProductReview,
  type InsertCartItem,
  type InsertOrder,
  type InsertOrderItem,
  type InsertProduct,
  type InsertProductReview,
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(productData: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(itemData: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Order operations
  createOrder(orderData: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(email: string): Promise<Order[]>;
  addOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // Review operations
  getReviewsByProduct(productId: number): Promise<ProductReview[]>;
  addReview(reviewData: InsertProductReview): Promise<ProductReview>;
}

class MemoryStorage implements IStorage {
  private products: Product[] = [];
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private reviews: ProductReview[] = [];
  private nextProductId = 1;
  private nextCartItemId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;
  private nextReviewId = 1;

  constructor() {
    this.initializeProducts();
    this.initializeReviews();
  }

  private initializeProducts() {
    // Produtos completos dos queijos linha premium do tabuademinas.com
    const initialProducts = [
      {
        id: 1,
        name: "Queijo MinasBri",
        description: "Queijo tipo Brie artesanal, cremoso e de sabor suave. Produzido com leite fresco das montanhas de Minas Gerais seguindo técnicas tradicionais francesas.",
        price500g: "33.90",
        price1kg: "33.90",
        originalPrice500g: null,
        originalPrice1kg: null,
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
        originalPrice500g: "63.90",
        originalPrice1kg: "63.90",
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
        originalPrice500g: "76.00",
        originalPrice1kg: "76.00",
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
        name: "Queijo Canastra Curado",
        description: "Queijo Canastra com cura especial, textura firme e sabor intenso. Ideal para quem aprecia queijos de personalidade marcante.",
        price500g: "79.00",
        price1kg: "79.00", 
        originalPrice500g: "86.00",
        originalPrice1kg: "86.00",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/6_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/6_300x.png?v=1751312328"],
        weight: "1kg",
        stock: 10,
        featured: true,
        discount: 8,
        rating: "4.8",
        reviews: 134,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Queijo Canastra Fresco 1kg",
        description: "Queijo Canastra fresco, textura macia e sabor suave. Perfeito para quem busca o sabor autêntico da Serra da Canastra.",
        price500g: "59.00",
        price1kg: "59.00",
        originalPrice500g: "65.00",
        originalPrice1kg: "65.00",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/7_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/7_300x.png?v=1751312328"],
        weight: "1kg",
        stock: 18,
        featured: false,
        discount: 9,
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 6,
        name: "Queijo Reino 1kg/1,5kg",
        description: "Queijo Reino artesanal com sabor acentuado e textura firme. Tradição mineira para paladares exigentes.",
        price500g: "75.00",
        price1kg: "75.00",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/8_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/8_300x.png?v=1751312328"],
        weight: "1kg/1,5kg",
        stock: 14,
        featured: true,
        discount: 0,
        rating: "4.6",
        reviews: 72,
        createdAt: new Date(),
      },
      {
        id: 10,
        name: "Doce de Abóbora com Coco",
        description: "Doce tradicional de abóbora com coco ralado, textura cremosa e sabor caseiro. Receita familiar passada por gerações.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/12_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/12_300x.png?v=1751312328"],
        weight: "500g - 1kg",
        stock: 22,
        featured: true,
        discount: 0,
        rating: "4.7",
        reviews: 156,
        createdAt: new Date(),
      },
      // DOCES ADICIONAIS DO IMGUR (IDs 28-35)
      {
        id: 28,
        name: "Doce Prestígio Mineiro",
        description: "Doce especial tipo prestígio com coco e chocolate. Receita mineira tradicional com toque especial, irresistível e cremoso.",
        price500g: "24.90",
        price1kg: "44.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/IdAa9ng.png",
        imageUrls: ["https://i.imgur.com/IdAa9ng.png"],
        weight: "500g - 1kg",
        stock: 18,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 142,
        createdAt: new Date(),
      },
      {
        id: 29,
        name: "Doce Quebra-Queixo",
        description: "Tradicional doce quebra-queixo mineiro com amendoim torrado. Textura crocante e sabor intenso, especialidade da casa.",
        price500g: "36.90",
        price1kg: "67.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/ded8MyO.png",
        imageUrls: ["https://i.imgur.com/ded8MyO.png"],
        weight: "500g - 1kg",
        stock: 15,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 198,
        createdAt: new Date(),
      },
      {
        id: 30,
        name: "Doce de Banana Zero Açúcar",
        description: "Doce de banana especial sem açúcar, adoçado naturalmente. Opção saudável sem perder o sabor tradicional mineiro.",
        price500g: "24.90",
        price1kg: "44.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/dOM2hia.png",
        imageUrls: ["https://i.imgur.com/dOM2hia.png"],
        weight: "500g - 1kg",
        stock: 20,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 87,
        createdAt: new Date(),
      },
      {
        id: 31,
        name: "Doce de Leite Dom",
        description: "Doce de leite premium da linha Dom, preparado com leite selecionado. Cremosidade e sabor incomparáveis, produto gourmet.",
        price500g: "44.90",
        price1kg: "84.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/lHpdysA.png",
        imageUrls: ["https://i.imgur.com/lHpdysA.png"],
        weight: "500g - 1kg",
        stock: 12,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 32,
        name: "Goiabada Cremosa Tia Carla",
        description: "Goiabada cremosa artesanal da Tia Carla com goiabas selecionadas. Textura suave e sabor autêntico, tradição familiar.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/uJPxQ3F.png",
        imageUrls: ["https://i.imgur.com/uJPxQ3F.png"],
        weight: "500g - 1kg",
        stock: 25,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 203,
        createdAt: new Date(),
      },
      // NOVOS DOCES ADICIONAIS DO IMGUR
      {
        id: 33,
        name: "Doce de Cocada com Maracujá",
        description: "Cocada artesanal com polpa de maracujá fresco. Combinação tropical única, doce refrescante com acidez equilibrada do maracujá.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/p6wwtEt.png",
        imageUrls: ["https://i.imgur.com/p6wwtEt.png"],
        weight: "500g - 1kg",
        stock: 16,
        featured: true,
        discount: 0,
        rating: "4.7",
        reviews: 134,
        createdAt: new Date(),
      },
      {
        id: 34,
        name: "Doce Casadinho",
        description: "Tradicional doce casadinho mineiro com duas camadas de sabores. Combinação perfeita de doce de leite e cocada, receita centenária.",
        price500g: "27.90",
        price1kg: "49.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://i.imgur.com/WoKuC7T.png",
        imageUrls: ["https://i.imgur.com/WoKuC7T.png"],
        weight: "500g - 1kg",
        stock: 22,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 176,
        createdAt: new Date(),
      }
    ];

    this.products = initialProducts;
    this.nextProductId = 35;
  }

  private initializeReviews() {
    const mockReviews = [
      {
        id: 1,
        productId: 1,
        customerName: "Maria Silva",
        rating: 5,
        comment: "Queijo excelente! Muito cremoso e saboroso.",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        productId: 1,
        customerName: "João Santos",
        rating: 4,
        comment: "Muito bom, lembra os queijos franceses.",
        createdAt: new Date("2024-01-10"),
      },
      {
        id: 3,
        productId: 2,
        customerName: "Ana Costa",
        rating: 5,
        comment: "Kit perfeito para degustação! Todos os queijos são deliciosos.",
        createdAt: new Date("2024-01-20"),
      },
    ];

    this.reviews = mockReviews;
    this.nextReviewId = mockReviews.length + 1;
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

  async createProduct(productData: InsertProduct): Promise<Product> {
    const product: Product = {
      id: this.nextProductId++,
      ...productData,
      reviews: productData.reviews ?? null,
      originalPrice500g: productData.originalPrice500g ?? null,
      originalPrice1kg: productData.originalPrice1kg ?? null,
      imageUrls: productData.imageUrls ?? null,
      weight: productData.weight ?? null,
      stock: productData.stock ?? null,
      featured: productData.featured ?? null,
      discount: productData.discount ?? null,
      rating: productData.rating ?? null,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return this.cartItems.filter(item => item.sessionId === sessionId);
  }

  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    const existingItem = this.cartItems.find(
      item => 
        item.sessionId === itemData.sessionId && 
        item.productId === itemData.productId &&
        item.size === itemData.size
    );

    if (existingItem) {
      existingItem.quantity += itemData.quantity;
      return existingItem;
    }

    const cartItem: CartItem = {
      id: this.nextCartItemId++,
      ...itemData,
      size: itemData.size || '500g',
      price: itemData.price || '0.00',
      createdAt: new Date(),
    };
    this.cartItems.push(cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
    }
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const index = this.cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      return true;
    }
    return false;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.sessionId !== sessionId);
    return this.cartItems.length < initialLength;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order: Order = {
      id: this.nextOrderId++,
      ...orderData,
      discount: orderData.discount || null,
      status: orderData.status || null,
      addressComplement: orderData.addressComplement || null,
      paymentMethod: orderData.paymentMethod || null,
      pixCode: orderData.pixCode || null,
      blackCatTransactionId: orderData.blackCatTransactionId || null,
      createdAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.find(order => order.id === id);
  }

  async getOrdersByCustomer(email: string): Promise<Order[]> {
    return this.orders.filter(order => order.customerEmail === email);
  }

  async addOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]> {
    const orderItems = orderItemsData.map(itemData => ({
      id: this.nextOrderItemId++,
      ...itemData,
      size: itemData.size || '500g',
      price: itemData.price || '0.00',
      createdAt: new Date(),
    }));
    this.orderItems.push(...orderItems);
    return orderItems;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.filter(item => item.orderId === orderId);
  }

  // Review operations
  async getReviewsByProduct(productId: number): Promise<ProductReview[]> {
    return this.reviews.filter(review => review.productId === productId);
  }

  async addReview(reviewData: InsertProductReview): Promise<ProductReview> {
    const review: ProductReview = {
      id: this.nextReviewId++,
      ...reviewData,
      comment: reviewData.comment || null,
      createdAt: new Date(),
    };
    this.reviews.push(review);
    return review;
  }
}

export const storage = new MemoryStorage();