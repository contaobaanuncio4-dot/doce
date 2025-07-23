import {
  products,
  cartItems,
  orders,
  orderItems,
  productReviews,
  type Product,
  type CartItem,
  type Order,
  type OrderItem,
  type ProductReview,
  type InsertProduct,
  type InsertCartItem,
  type InsertOrder,
  type InsertOrderItem,
  type InsertProductReview,
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(email: string): Promise<Order[]>;
  addOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Review operations
  getReviewsByProduct(productId: number): Promise<ProductReview[]>;
  addReview(review: InsertProductReview): Promise<ProductReview>;
}

export class MemoryStorage implements IStorage {
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
    const initialProducts = [
      // QUEIJOS AUTÊNTICOS (IDs 1-17)
      {
        id: 1,
        name: "Queijo MinasBri",
        description: "Queijo tipo Brie artesanal, cremoso e de sabor suave. Produzido com leite fresco das montanhas de Minas Gerais seguindo técnicas tradicionais francesas.",
        price500g: "33.90",
        price1kg: "67.80",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/minasbri_640x.jpg?v=1751561892",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/minasbri_640x.jpg?v=1751561892"],
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
        price1kg: "113.47",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960"],
        weight: "475g",
        stock: 8,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 65,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Queijo Canastra Meia Cura",
        description: "Queijo Canastra tradicional com meia cura, sabor marcante e textura firme. Direto da Serra da Canastra, região patrimônio da humanidade.",
        price500g: "69.00",
        price1kg: "57.50",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/5_300x.png?v=1751312328",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/5_300x.png?v=1751312328"],
        weight: "1kg/1,2kg",
        stock: 12,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Queijo Lua Cheia",
        description: "Queijo artesanal com sabor único e textura cremosa. Uma especialidade que lembra a suavidade da lua cheia nas montanhas mineiras.",
        price500g: "45.90",
        price1kg: "76.50",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/slc_300x.png?v=1751559866",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/slc_300x.png?v=1751559866"],
        weight: "300g",
        stock: 20,
        featured: true,
        discount: 0,
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Queijo do Jordão",
        description: "Queijo artesanal produzido na região do Jordão, com sabor marcante e tradição centenária. Perfeito para degustação.",
        price500g: "36.90",
        price1kg: "52.71",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/jordao_300x.jpg?v=1751562075",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/jordao_300x.jpg?v=1751562075"],
        weight: "350g",
        stock: 15,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 78,
        createdAt: new Date(),
      },
      {
        id: 6,
        name: "Queijo Figueira",
        description: "Queijo artesanal com personalidade única, produzido seguindo métodos tradicionais mineiros. Sabor refinado e textura especial.",
        price500g: "39.90",
        price1kg: "66.50",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/figueira_300x.jpg?v=1751562412",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/figueira_300x.jpg?v=1751562412"],
        weight: "300g",
        stock: 18,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 145,
        createdAt: new Date(),
      },
      {
        id: 17,
        name: "Queijo Tipo Camembert",
        description: "Queijo tipo Camembert artesanal, cremoso e aromático. Produzido com técnicas francesas adaptadas ao terroir mineiro.",
        price500g: "34.90",
        price1kg: "69.80",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/camem_300x.jpg?v=1751562888",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/camem_300x.jpg?v=1751562888"],
        weight: "250g",
        stock: 12,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 167,
        createdAt: new Date(),
      },
      {
        id: 18,
        name: "Queijo Gorgonzola Duplo Creme - Meia Peça",
        description: "Gorgonzola artesanal duplo creme com sabor intenso e textura cremosa. Perfeito para tábuas de queijo sofisticadas.",
        price500g: "49.90",
        price1kg: "71.29",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/gogonzola_duplo_300x.jpg?v=1751562344",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/gogonzola_duplo_300x.jpg?v=1751562344"],
        weight: "350g",
        stock: 8,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 94,
        createdAt: new Date(),
      },
      {
        id: 19,
        name: "Queijo Tipo Gruyere",
        description: "Queijo tipo Gruyere artesanal com sabor característico e textura firme. Ideal para fondue ou consumo puro.",
        price500g: "42.90",
        price1kg: "61.29",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/gruyere_300x.jpg?v=1751562252",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/gruyere_300x.jpg?v=1751562252"],
        weight: "350g",
        stock: 10,
        featured: false,
        discount: 0,
        rating: "4.7",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 20,
        name: "Queijo Estação Mantiqueira de Minas",
        description: "Queijo especial da região da Mantiqueira, com sabor único e tradição familiar. Produto premium de alta qualidade.",
        price500g: "58.90",
        price1kg: "58.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/2_2e699a84-8039-47b9-aac5-e7dad34ea0fa_300x.png?v=1751605312",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/2_2e699a84-8039-47b9-aac5-e7dad34ea0fa_300x.png?v=1751605312"],
        weight: "500g",
        stock: 6,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 203,
        createdAt: new Date(),
      },
      {
        id: 21,
        name: "Queijo Tipo Comté",
        description: "Queijo tipo Comté artesanal com sabor complexo e textura firme. Uma especialidade francesa produzida em Minas Gerais.",
        price500g: "36.90",
        price1kg: "57.66",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/conte_700x.jpg?v=1751604692",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/conte_700x.jpg?v=1751604692"],
        weight: "320g",
        stock: 14,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 78,
        createdAt: new Date(),
      },
      {
        id: 22,
        name: "Queijo Morro Azul",
        description: "Queijo artesanal com casca azul característica, sabor marcante e tradição centenária da região montanhosa.",
        price500g: "36.90",
        price1kg: "153.75",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/morroazul_300x.png?v=1751561820",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/morroazul_300x.png?v=1751561820"],
        weight: "120g",
        stock: 16,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 124,
        createdAt: new Date(),
      },
      {
        id: 23,
        name: "Queijo Bucaneve",
        description: "Queijo premium com textura cremosa e sabor refinado. Uma especialidade italiana produzida artesanalmente em Minas.",
        price500g: "42.90",
        price1kg: "107.25",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/bucaneve_300x.jpg?v=1751562570",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/bucaneve_300x.jpg?v=1751562570"],
        weight: "200g",
        stock: 9,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 24,
        name: "Queijo da Santa",
        description: "Queijo tradicional com receita centenária, produzido com leite fresco e métodos artesanais preservados há gerações.",
        price500g: "68.90",
        price1kg: "52.99",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/dasantacerto_300x.png?v=1751560720",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/dasantacerto_300x.png?v=1751560720"],
        weight: "650g",
        stock: 7,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 25,
        name: "Queijo Gorgonzola Duplo Creme - Peça Inteira",
        description: "Gorgonzola artesanal duplo creme peça inteira com sabor intenso. Ideal para grandes ocasiões e tábuas especiais.",
        price500g: "78.90",
        price1kg: "56.36",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/gogonzola_duplo_300x.jpg?v=1751562344",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/gogonzola_duplo_300x.jpg?v=1751562344"],
        weight: "700g",
        stock: 4,
        featured: false,
        discount: 0,
        rating: "4.7",
        reviews: 67,
        createdAt: new Date(),
      },
      {
        id: 26,
        name: "Queijo Benzinho",
        description: "Queijo artesanal com sabor suave e textura cremosa. Perfeito para quem aprecia queijos delicados e refinados.",
        price500g: "48.90",
        price1kg: "122.25",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/benzinho_300x.jpg?v=1751562628",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/benzinho_300x.jpg?v=1751562628"],
        weight: "200g",
        stock: 11,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 134,
        createdAt: new Date(),
      },
      {
        id: 27,
        name: "Queijo Chabichou",
        description: "Queijo tipo cabra francês produzido artesanalmente. Sabor característico e textura única, uma verdadeira especialidade.",
        price500g: "49.90",
        price1kg: "99.80",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "queijos",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/chabichou_300x.jpg?v=1751562471",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/chabichou_300x.jpg?v=1751562471"],
        weight: "Variável",
        stock: 8,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 98,
        createdAt: new Date(),
      },
      // DOCES (IDs 7-15) - PRODUTOS AUTÊNTICOS FORNECIDOS PELO USUÁRIO
      {
        id: 7,
        name: "Doce de Pingo de Leite com Castanha de Caju",
        description: "Delicioso doce de pingo de leite artesanal com castanha de caju torrada. Cremoso e saboroso, uma especialidade mineira irresistível.",
        price500g: "34.90",
        price1kg: "63.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/taq_700x.png?v=1751478341",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/taq_700x.png?v=1751478341"],
        weight: "500g - 1kg",
        stock: 20,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 203,
        createdAt: new Date(),
      },
      {
        id: 8,
        name: "Doce de Cocada com Abacaxi",
        description: "Cocada artesanal com pedaços de abacaxi fresco. Combinação tropical perfeita, doce tradicional com toque refrescante.",
        price500g: "33.90",
        price1kg: "61.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/abacaxi_700x.png?v=1751475432",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/abacaxi_700x.png?v=1751475432"],
        weight: "500g - 1kg",
        stock: 25,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 9,
        name: "Doce de Cocada com Maracujá",
        description: "Cocada artesanal com polpa de maracujá natural. Sabor tropical e refrescante, perfeita combinação doce e azedinho.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/maracuja_700x.png?v=1751475750",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/maracuja_700x.png?v=1751475750"],
        weight: "500g - 1kg",
        stock: 22,
        featured: true,
        discount: 0,
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 10,
        name: "Doce Casadinho",
        description: "Tradicional doce casadinho mineiro com duas camadas de sabor. Uma mistura harmoniosa que representa a culinária de Minas.",
        price500g: "27.90",
        price1kg: "49.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/xaaf_700x.png?v=1751314094",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/xaaf_700x.png?v=1751314094"],
        weight: "500g - 1kg",
        stock: 25,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 134,
        createdAt: new Date(),
      },
      {
        id: 11,
        name: "Doce de Leite Tradicional",
        description: "Doce de leite artesanal preparado no tacho de cobre. Cremoso e saboroso, perfeito para sobremesas ou consumo puro.",
        price500g: "22.90",
        price1kg: "39.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/adssdasd_700x.png?v=1751314259",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/adssdasd_700x.png?v=1751314259", "https://tabuademinas.com/cdn/shop/files/dadas_700x.png?v=1751314249"],
        weight: "500g - 1kg",
        stock: 30,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 312,
        createdAt: new Date(),
      },
      {
        id: 12,
        name: "Doce de Leite com Café",
        description: "Doce de leite especial com café torrado e moído. Combinação perfeita para os amantes de café, sabor intenso e cremoso.",
        price500g: "26.90",
        price1kg: "47.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/a1_300x.png?v=1751314696",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/a1_300x.png?v=1751314696"],
        weight: "500g - 1kg",
        stock: 18,
        featured: true,
        discount: 0,
        rating: "4.8",
        reviews: 198,
        createdAt: new Date(),
      },
      {
        id: 13,
        name: "Doce de Pingo de Leite com Amendoim",
        description: "Tradicional doce de pingo de leite com amendoim torrado. Textura cremosa e sabor intenso, uma especialidade mineira premium.",
        price500g: "57.90",
        price1kg: "109.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/36_700x.png?v=1751313980",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/36_700x.png?v=1751313980", "https://tabuademinas.com/cdn/shop/files/37_700x.png?v=1751313980"],
        weight: "500g - 1kg",
        stock: 12,
        featured: true,
        discount: 0,
        rating: "4.9",
        reviews: 167,
        createdAt: new Date(),
      },
      {
        id: 14,
        name: "Doce de Cocada com Ameixa",
        description: "Cocada artesanal com ameixas secas selecionadas. Combinação única de texturas e sabores, doce sofisticado e saboroso.",
        price500g: "32.90",
        price1kg: "59.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_700x.png?v=1751475618",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_700x.png?v=1751475618", "https://tabuademinas.com/cdn/shop/files/2_4de1745d-9583-455e-a299-d0ac9614aba2_700x.png?v=1751475618"],
        weight: "500g - 1kg",
        stock: 20,
        featured: false,
        discount: 0,
        rating: "4.6",
        reviews: 94,
        createdAt: new Date(),
      },
      {
        id: 15,
        name: "Doce de Abóbora com Coco",
        description: "Doce de abóbora tradicional com coco ralado fresco. Preparado no tacho de cobre seguindo receita centenária mineira.",
        price500g: "27.90",
        price1kg: "49.90",
        originalPrice500g: null,
        originalPrice1kg: null,
        category: "doces",
        imageUrl: "https://tabuademinas.com/cdn/shop/files/14_700x.png?v=1751314396",
        imageUrls: ["https://tabuademinas.com/cdn/shop/files/14_700x.png?v=1751314396", "https://tabuademinas.com/cdn/shop/files/13_700x.png?v=1751314396"],
        weight: "500g - 1kg",
        stock: 22,
        featured: true,
        discount: 0,
        rating: "4.7",
        reviews: 156,
        createdAt: new Date(),
      }
    ];

    this.products = initialProducts;
    this.nextProductId = 28;
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