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
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Queijo Parmesão Artesanal",
        description: "Queijo tipo parmesão produzido artesanalmente em Minas Gerais. Perfeito para gratinar ou consumir puro.",
        price500g: "45.90",
        price1kg: "85.90",
        originalPrice500g: "52.00",
        originalPrice1kg: "97.50",
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/parmesao_300x.png?v=1751561960",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/parmesao_300x.png?v=1751561960"],
        weight: "500g - 1kg",
        stock: 20,
        featured: true,
        discount: 12,
        rating: "4.8",
        reviews: 145,
        createdAt: new Date(),
      },
      {
        id: 6,
        name: "Queijo Minas Padrão",
        description: "Tradicional queijo minas padrão, cremoso e suave. Produzido seguindo a receita original mineira.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/minas-padrao_300x.png?v=1751561892",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/minas-padrao_300x.png?v=1751561892"],
        weight: "500g - 1kg",
        stock: 25,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 78,
        createdAt: new Date(),
      },
      {
        id: 7,
        name: "Doce Prestígio Mineiro",
        description: "Inspirado no famoso doce brasileiro, nossa versão artesanal combina coco fresco com cobertura de chocolate. Uma explosão de sabores que remete à infância.",
        price500g: "24.90",
        price1kg: "40.29",
        originalPrice500g: "46.00",
        originalPrice1kg: "50.60",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/rpomei_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/rpomei_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 20,
        featured: true,
        discount: 26,
        rating: "4.9",
        reviews: 203,
        createdAt: new Date(),
      },
      {
        id: 8,
        name: "Doce de Leite Tradicional",
        description: "Doce de leite artesanal preparado no tacho de cobre. Cremoso e saboroso, perfeito para sobremesas ou puro.",
        price500g: "18.90",
        price1kg: "32.90",
        originalPrice500g: "22.90",
        originalPrice1kg: "38.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/doce-leite_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/doce-leite_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 30,
        featured: true,
        discount: 18,
        rating: "4.9",
        reviews: 312,
        createdAt: new Date(),
      },
      {
        id: 9,
        name: "Queijo Coalho Artesanal",
        description: "Tradicional queijo coalho nordestino produzido em Minas. Ideal para grelhar ou consumir fresco.",
        price500g: "32.90",
        price1kg: "58.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/coalho_300x.png?v=1751561892",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/coalho_300x.png?v=1751561892"],
        weight: "500g - 1kg",
        stock: 18,
        featured: false,
        discount: 0,
        rating: "4.5",
        reviews: 67,
        createdAt: new Date(),
      },
      {
        id: 10,
        name: "Queijo Canastra Fresco",
        description: "Queijo Canastra fresco, cremoso e suave. Direto da Serra da Canastra com toda a tradição mineira.",
        price500g: "45.90",
        price1kg: "82.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/canastra-fresco_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/canastra-fresco_300x.png?v=1751312328"],
        weight: "500g - 1kg",
        stock: 15,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 124,
        createdAt: new Date(),
      },
      {
        id: 11,
        name: "Doce de Mamão com Coco",
        description: "Delicioso doce de mamão com coco ralado fresco. Receita tradicional mineira com sabor caseiro.",
        price500g: "21.90",
        price1kg: "35.90",
        originalPrice500g: "28.90",
        originalPrice1kg: "42.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/mamao-coco_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/mamao-coco_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 25,
        featured: true,
        discount: 24,
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 12,
        name: "Doce de Abóbora Tradicional",
        description: "Doce de abóbora preparado no tacho de cobre seguindo receita centenária. Cremoso e saboroso.",
        price500g: "19.90",
        price1kg: "33.90",
        originalPrice500g: "24.90",
        originalPrice1kg: "39.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/abobora_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/abobora_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 22,
        featured: false,
        discount: 20,
        rating: "4.6",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 13,
        name: "Doce de Figo Cristalizado",
        description: "Figos cristalizados em calda especial, uma tradição mineira. Doce refinado e saboroso, perfeito para ocasiões especiais.",
        price500g: "28.90",
        price1kg: "52.90",
        originalPrice500g: "34.90",
        originalPrice1kg: "62.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/figo_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/figo_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 15,
        featured: true,
        discount: 17,
        rating: "4.8",
        reviews: 94,
        createdAt: new Date(),
      },
      {
        id: 14,
        name: "Rapadura Mineira Tradicional",
        description: "Rapadura artesanal feita com cana-de-açúcar pura. Doce tradicional mineiro com sabor autêntico e textura perfeita.",
        price500g: "16.90",
        price1kg: "29.90",
        originalPrice500g: "21.90",
        originalPrice1kg: "36.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/rapadura_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/rapadura_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 30,
        featured: true,
        discount: 23,
        rating: "4.7",
        reviews: 178,
        createdAt: new Date(),
      },
      {
        id: 15,
        name: "Doce de Banana Passa",
        description: "Delicioso doce de banana passa artesanal. Feito com bananas selecionadas e açúcar cristal, seguindo receita tradicional.",
        price500g: "22.90",
        price1kg: "39.90",
        originalPrice500g: "27.90",
        originalPrice1kg: "47.90",
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/banana-passa_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/banana-passa_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 20,
        featured: false,
        discount: 18,
        rating: "4.6",
        reviews: 127,
        createdAt: new Date(),
      },
      {
        id: 16,
        name: "Marmelada Caseira",
        description: "Marmelada artesanal feita com marmelos frescos da região. Textura firme e sabor intenso, ideal para acompanhar queijos.",
        price500g: "25.90",
        price1kg: "44.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/marmelada_300x.png?v=1751314611",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/marmelada_300x.png?v=1751314611"],
        weight: "500g - 1kg",
        stock: 18,
        featured: true,
        discount: 0,
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
      size: cartItem.size || "500g",
      price: cartItem.price || "0.00",
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
      status: order.status || "pending",
      customerCpf: order.customerCpf || null,
      complement: order.complement || null,
      cep: order.cep || null,
      state: order.state || null,
      total: order.total || "0.00",
      shippingCost: order.shippingCost || "0.00",
      discount: order.discount || null,
      pixCode: order.pixCode || null,
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