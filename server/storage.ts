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
    // Produtos completos - 33 produtos (19 queijos + 14 doces)
    const initialProducts = [
      {
        id: 1,
        name: "Queijo MinasBri",
        description: "Queijo tipo Brie artesanal, cremoso e de sabor suave. Produzido com leite fresco das montanhas de Minas Gerais seguindo técnicas tradicionais francesas.",
        price500g: "33.90",
        price1kg: "64.90",
        originalPrice500g: "64.90",
        originalPrice1kg: "129.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/90GxB2fm.jpg",
        imageUrls: ["https://i.imgur.com/90GxB2fm.jpg"],
        weight: "500g",
        stock: 15,
        featured: true,
        discount: 47,
        rating: "4.8",
        reviews: 92,
        checkout500g: "https://pay.tabuademinas.fun/6886ed52ed44f872dda1bc08",
        checkout1kg: "https://pay.tabuademinas.fun/6886ed70cbb7096b50749f31",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Kit 4 Queijos de Alagoa-MG (parmesão)",
        description: "Kit especial com 4 queijos artesanais tipo parmesão de Alagoa, Minas Gerais. Perfeito para degustação e presente para amantes de queijo.",
        price500g: "53.90",
        price1kg: "113.47",
        originalPrice500g: "100.90",
        originalPrice1kg: "212.42",
        category: "queijos",
        imageUrl: "https://i.imgur.com/HUMvcjfm.jpg",
        imageUrls: ["https://i.imgur.com/HUMvcjfm.jpg"],
        weight: "475g",
        stock: 8,
        featured: true,
        discount: 46,
        rating: "4.9",
        reviews: 65,
        checkout500g: "https://pay.tabuademinas.fun/6886ed97cbb7096b50749f69",
        checkout1kg: "https://pay.tabuademinas.fun/6886edc8ed44f872dda1bc50",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Queijo Canastra Meia Cura",
        description: "Autêntico queijo Canastra com maturação de 15 dias. Sabor marcante e textura firme, produzido na Serra da Canastra seguindo métodos tradicionais.",
        price500g: "69.00",
        price1kg: "138.00",
        originalPrice500g: "94.90",
        originalPrice1kg: "189.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/3FW0QQom.jpg",
        imageUrls: ["https://i.imgur.com/3FW0QQom.jpg"],
        weight: "500g",
        stock: 12,
        featured: true,
        discount: 27,
        rating: "4.9",
        reviews: 143,
        checkout500g: "https://pay.tabuademinas.fun/6886d638cbb7096b507489af",
        checkout1kg: "https://pay.tabuademinas.fun/6886d64acbb7096b507489dc",
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Queijo Gorgonzola Duplo Creme - Meia Peça",
        description: "Gorgonzola extra cremoso com duplo teor de gordura. Sabor suave e equilibrado com veios azuis característicos. Ideal para tábuas de frios e molhos.",
        price500g: "49.90",
        price1kg: "99.80",
        originalPrice500g: "89.90",
        originalPrice1kg: "179.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/GKEwp5Zm.jpg",
        imageUrls: ["https://i.imgur.com/GKEwp5Zm.jpg"],
        weight: "500g",
        stock: 10,
        featured: false,
        discount: 44,
        rating: "4.7",
        reviews: 87,
        checkout500g: "https://pay.tabuademinas.fun/6886d60eed44f872dda1a937",
        checkout1kg: "https://pay.tabuademinas.fun/6886d625ed44f872dda1a95d",
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "Queijo Tipo Camembert",
        description: "Queijo de casca branca aveludada e interior cremoso. Sabor delicado com notas de cogumelo, perfeito para acompanhar pães e geleias.",
        price500g: "34.90",
        price1kg: "69.80",
        originalPrice500g: "61.90",
        originalPrice1kg: "123.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/lUEzXTgm.jpg",
        imageUrls: ["https://i.imgur.com/lUEzXTgm.jpg"],
        weight: "250g",
        stock: 18,
        featured: true,
        discount: 43,
        rating: "4.6",
        reviews: 76,
        checkout500g: "https://pay.tabuademinas.fun/6886d5e3cbb7096b5074896a",
        checkout1kg: "https://pay.tabuademinas.fun/6886d5cbcbb7096b50748931",
        createdAt: new Date(),
      },
      {
        id: 6,
        name: "Queijo Figueira",
        description: "Queijo artesanal exclusivo, maturado sob folhas de figueira. Sabor único com notas herbáceas e textura semi-firme. Produção limitada.",
        price500g: "39.90",
        price1kg: "79.80",
        originalPrice500g: "72.90",
        originalPrice1kg: "145.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/50TuZclm.jpg",
        imageUrls: ["https://i.imgur.com/50TuZclm.jpg"],
        weight: "300g",
        stock: 7,
        featured: false,
        discount: 45,
        rating: "4.8",
        reviews: 54,
        createdAt: new Date(),
      },
      {
        id: 7,
        name: "Parmesão Meia Cura",
        description: "Parmesão artesanal com 6 meses de maturação. Sabor intenso e levemente picante, textura granulosa ideal para ralar ou consumir em lascas.",
        price500g: "44.90",
        price1kg: "89.80",
        originalPrice500g: "74.90",
        originalPrice1kg: "149.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/lJzrIPtm.jpg",
        imageUrls: ["https://i.imgur.com/lJzrIPtm.jpg"],
        weight: "500g",
        stock: 20,
        featured: false,
        discount: 40,
        rating: "4.9",
        reviews: 112,
        createdAt: new Date(),
      },
      {
        id: 8,
        name: "Queijo do Jordão",
        description: "Queijo artesanal da região do Jordão, com sabor suave e textura cremosa. Produzido com leite de vacas criadas em pastagens naturais.",
        price500g: "36.90",
        price1kg: "73.80",
        originalPrice500g: "80.90",
        originalPrice1kg: "161.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/IIOVRsgm.jpg",
        imageUrls: ["https://i.imgur.com/IIOVRsgm.jpg"],
        weight: "400g",
        stock: 14,
        featured: false,
        discount: 54,
        rating: "4.5",
        reviews: 68,
        createdAt: new Date(),
      },
      {
        id: 9,
        name: "Queijo Lua Cheia",
        description: "Queijo especial com formato redondo que lembra a lua cheia. Maturação de 30 dias, sabor equilibrado entre suave e marcante.",
        price500g: "45.90",
        price1kg: "91.80",
        originalPrice500g: "89.90",
        originalPrice1kg: "179.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/Hiizu7lm.jpg",
        imageUrls: ["https://i.imgur.com/Hiizu7lm.jpg"],
        weight: "450g",
        stock: 11,
        featured: true,
        discount: 49,
        rating: "4.7",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 10,
        name: "Canastra Santiago",
        description: "Queijo Canastra produzido na fazenda Santiago. Maturação controlada, sabor autêntico da serra com notas minerais características.",
        price500g: "24.90",
        price1kg: "49.80",
        originalPrice500g: "45.00",
        originalPrice1kg: "90.00",
        category: "queijos",
        imageUrl: "https://i.imgur.com/WTEH3EGm.jpg",
        imageUrls: ["https://i.imgur.com/WTEH3EGm.jpg"],
        weight: "300g",
        stock: 25,
        featured: true,
        discount: 44,
        rating: "4.6",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 11,
        name: "Queijo Chabichou",
        description: "Queijo de cabra tipo francês, com textura cremosa e sabor delicado. Formato cilíndrico tradicional, perfeito para ocasiões especiais.",
        price500g: "49.90",
        price1kg: "99.80",
        originalPrice500g: "84.90",
        originalPrice1kg: "169.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/InCGS2im.jpg",
        imageUrls: ["https://i.imgur.com/InCGS2im.jpg"],
        weight: "200g",
        stock: 9,
        featured: false,
        discount: 41,
        rating: "4.8",
        reviews: 43,
        createdAt: new Date(),
      },
      {
        id: 12,
        name: "Queijo Benzinho",
        description: "Queijo artesanal suave e delicado, ideal para crianças e paladares sensíveis. Textura macia e sabor levemente adocicado.",
        price500g: "48.90",
        price1kg: "97.80",
        originalPrice500g: "76.90",
        originalPrice1kg: "153.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/GhkwDOzm.jpg",
        imageUrls: ["https://i.imgur.com/GhkwDOzm.jpg"],
        weight: "350g",
        stock: 16,
        featured: false,
        discount: 36,
        rating: "4.5",
        reviews: 71,
        createdAt: new Date(),
      },
      {
        id: 13,
        name: "Queijo Gorgonzola Duplo Creme - Peça inteira",
        description: "Peça inteira de Gorgonzola duplo creme. Ideal para restaurantes e grandes eventos. Sabor intenso e cremosidade incomparável.",
        price500g: "39.45",
        price1kg: "78.90",
        originalPrice500g: "66.95",
        originalPrice1kg: "133.90",
        category: "queijos",
        imageUrl: "https://i.imgur.com/yrLmjZFm.jpg",
        imageUrls: ["https://i.imgur.com/yrLmjZFm.jpg"],
        weight: "1kg",
        stock: 5,
        featured: false,
        discount: 41,
        rating: "4.9",
        reviews: 124,
        createdAt: new Date(),
      },
      {
        id: 14,
        name: "Queijo da Santa",
        description: "Queijo tradicional abençoado, produzido por freiras. Receita centenária com sabor único e textura firme. Edição limitada.",
        price500g: "53.00",
        price1kg: "106.00",
        originalPrice500g: "103.77",
        originalPrice1kg: "207.54",
        category: "queijos",
        imageUrl: "https://i.imgur.com/AP6tuzNm.jpg",
        imageUrls: ["https://i.imgur.com/AP6tuzNm.jpg"],
        weight: "650g",
        stock: 6,
        featured: true,
        discount: 49,
        rating: "4.9",
        reviews: 178,
        createdAt: new Date(),
      },
      {
        id: 15,
        name: "Queijo Bucaneve",
        description: "Queijo italiano importado, com textura macia e sabor delicado. Coberto com uma fina camada de cinza comestível que realça o sabor.",
        price500g: "107.25",
        price1kg: "214.50",
        originalPrice500g: "202.25",
        originalPrice1kg: "404.50",
        category: "queijos",
        imageUrl: "https://i.imgur.com/N1LqA2Nm.jpg",
        imageUrls: ["https://i.imgur.com/N1LqA2Nm.jpg"],
        weight: "200g",
        stock: 4,
        featured: false,
        discount: 47,
        rating: "4.7",
        reviews: 32,
        createdAt: new Date(),
      },
      {
        id: 16,
        name: "Queijo Morro Azul",
        description: "Queijo azul artesanal brasileiro, produzido nas montanhas. Sabor intenso e picante, com veios azuis bem distribuídos.",
        price500g: "153.75",
        price1kg: "307.50",
        originalPrice500g: "253.75",
        originalPrice1kg: "507.50",
        category: "queijos",
        imageUrl: "https://i.imgur.com/DZEoLC7m.jpg",
        imageUrls: ["https://i.imgur.com/DZEoLC7m.jpg"],
        weight: "120g",
        stock: 8,
        featured: false,
        discount: 39,
        rating: "4.6",
        reviews: 45,
        createdAt: new Date(),
      },
      {
        id: 17,
        name: "Queijo Tipo Comté",
        description: "Queijo tipo francês com maturação de 12 meses. Sabor complexo com notas de frutas secas e avelã. Textura firme e cremosa.",
        price500g: "57.66",
        price1kg: "115.32",
        originalPrice500g: "107.66",
        originalPrice1kg: "215.32",
        category: "queijos",
        imageUrl: "https://i.imgur.com/R2SqLybm.jpg",
        imageUrls: ["https://i.imgur.com/R2SqLybm.jpg"],
        weight: "320g",
        stock: 10,
        featured: false,
        discount: 46,
        rating: "4.8",
        reviews: 67,
        createdAt: new Date(),
      },
      {
        id: 18,
        name: "Queijo Estação Mantiqueira de minas",
        description: "Queijo premium da região da Mantiqueira. Produzido em altitude elevada, com sabor único influenciado pelo terroir local.",
        price500g: "58.90",
        price1kg: "117.80",
        originalPrice500g: "100.90",
        originalPrice1kg: "201.80",
        category: "queijos",
        imageUrl: "https://i.imgur.com/2pn5qcPm.jpg",
        imageUrls: ["https://i.imgur.com/2pn5qcPm.jpg"],
        weight: "500g",
        stock: 13,
        featured: true,
        discount: 41,
        rating: "4.9",
        reviews: 91,
        createdAt: new Date(),
      },
      {
        id: 19,
        name: "Queijo Tipo Gruyere",
        description: "Queijo tipo suíço com maturação de 8 meses. Sabor frutado e levemente adocicado, ideal para fondues e gratinados.",
        price500g: "61.29",
        price1kg: "122.58",
        originalPrice500g: "111.29",
        originalPrice1kg: "222.58",
        category: "queijos",
        imageUrl: "https://i.imgur.com/LS1tjBNm.jpg",
        imageUrls: ["https://i.imgur.com/LS1tjBNm.jpg"],
        weight: "350g",
        stock: 15,
        featured: false,
        discount: 45,
        rating: "4.7",
        reviews: 83,
        createdAt: new Date(),
      },
  // DOCES
      {
        id: 20,
        name: "Doce de Pingo de Leite com Castanha de Caju",
        description: "Tradicional doce mineiro de leite com pedaços generosos de castanha de caju. Cremoso e na medida certa de doçura.",
        price500g: "34.90",
        price1kg: "69.80",
        originalPrice500g: "60.90",
        originalPrice1kg: "121.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/jcNfoUSm.jpg",
        imageUrls: ["https://i.imgur.com/jcNfoUSm.jpg"],
        weight: "400g",
        stock: 22,
        featured: true,
        discount: 42,
        rating: "4.8",
        reviews: 134,
        createdAt: new Date(),
      },
      {
        id: 21,
        name: "Doce de Cocada com Abacaxi",
        description: "Cocada artesanal com pedaços de abacaxi fresco. Textura macia e sabor tropical irresistível. Receita de família.",
        price500g: "33.90",
        price1kg: "67.80",
        originalPrice500g: "46.00",
        originalPrice1kg: "92.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/bf7uIkJm.jpg",
        imageUrls: ["https://i.imgur.com/bf7uIkJm.jpg"],
        weight: "350g",
        stock: 18,
        featured: false,
        discount: 26,
        rating: "4.6",
        reviews: 98,
        createdAt: new Date(),
      },
      {
        id: 22,
        name: "Doce Prestígio mineiro",
        description: "Versão mineira do clássico prestígio. Doce de leite com coco ralado e cobertura de chocolate. Simplesmente irresistível.",
        price500g: "24.90",
        price1kg: "49.80",
        originalPrice500g: "41.90",
        originalPrice1kg: "83.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/IdAa9ngm.jpg",
        imageUrls: ["https://i.imgur.com/IdAa9ngm.jpg"],
        weight: "300g",
        stock: 30,
        featured: true,
        discount: 40,
        rating: "4.9",
        reviews: 167,
        createdAt: new Date(),
      },
      {
        id: 23,
        name: "Doce de Cocada com Maracujá",
        description: "Cocada cremosa com polpa de maracujá natural. Combinação perfeita entre o doce do coco e o azedinho do maracujá.",
        price500g: "32.90",
        price1kg: "65.80",
        originalPrice500g: "43.90",
        originalPrice1kg: "87.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/p6wwtEtm.jpg",
        imageUrls: ["https://i.imgur.com/p6wwtEtm.jpg"],
        weight: "350g",
        stock: 20,
        featured: false,
        discount: 25,
        rating: "4.7",
        reviews: 112,
        createdAt: new Date(),
      },
      {
        id: 24,
        name: "Doce casadinho",
        description: "Tradicional doce de festa junina. Duas metades de biscoito recheadas com doce de leite cremoso. Nostalgia em cada mordida.",
        price500g: "27.90",
        price1kg: "55.80",
        originalPrice500g: "45.00",
        originalPrice1kg: "90.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/WoKuC7Tm.jpg",
        imageUrls: ["https://i.imgur.com/WoKuC7Tm.jpg"],
        weight: "250g",
        stock: 35,
        featured: false,
        discount: 38,
        rating: "4.5",
        reviews: 89,
        createdAt: new Date(),
      },
      {
        id: 25,
        name: "Doce de leite",
        description: "Doce de leite puro artesanal, cremoso e no ponto certo. Feito com leite fresco e muito carinho. Tradição mineira.",
        price500g: "22.90",
        price1kg: "45.80",
        originalPrice500g: "40.00",
        originalPrice1kg: "80.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/7l56V5mm.jpg",
        imageUrls: ["https://i.imgur.com/7l56V5mm.jpg"],
        weight: "400g",
        stock: 40,
        featured: true,
        discount: 42,
        rating: "4.9",
        reviews: 234,
        createdAt: new Date(),
      },
      {
        id: 26,
        name: "Doce de leite com café",
        description: "Doce de leite enriquecido com café especial mineiro. Sabor único para os amantes de café. Cremoso e aromático.",
        price500g: "26.90",
        price1kg: "53.80",
        originalPrice500g: "45.00",
        originalPrice1kg: "90.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/dEVNMOdm.jpg",
        imageUrls: ["https://i.imgur.com/dEVNMOdm.jpg"],
        weight: "400g",
        stock: 28,
        featured: true,
        discount: 40,
        rating: "4.8",
        reviews: 145,
        createdAt: new Date(),
      },
      {
        id: 27,
        name: "Doce de Pingo de Leite com Amendoim",
        description: "Doce de leite especial com amendoim torrado e crocante. Textura cremosa com pedaços generosos de amendoim.",
        price500g: "58.90",
        price1kg: "117.80",
        originalPrice500g: "80.90",
        originalPrice1kg: "161.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/o74KsOom.jpg",
        imageUrls: ["https://i.imgur.com/o74KsOom.jpg"],
        weight: "500g",
        stock: 15,
        featured: false,
        discount: 27,
        rating: "4.7",
        reviews: 93,
        createdAt: new Date(),
      },
      {
        id: 28,
        name: "Doce de Cocada com Ameixa",
        description: "Cocada diferenciada com pedaços de ameixa seca. Combinação sofisticada de sabores, textura macia e equilibrada.",
        price500g: "32.90",
        price1kg: "65.80",
        originalPrice500g: "43.90",
        originalPrice1kg: "87.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/Rt7nWy8m.jpg",
        imageUrls: ["https://i.imgur.com/Rt7nWy8m.jpg"],
        weight: "350g",
        stock: 12,
        featured: false,
        discount: 25,
        rating: "4.6",
        reviews: 67,
        createdAt: new Date(),
      },
      {
        id: 29,
        name: "Doce de Abóbora com Coco",
        description: "Doce caseiro de abóbora com coco ralado fresco. Receita tradicional da vovó, com sabor que remete à infância.",
        price500g: "27.90",
        price1kg: "55.80",
        originalPrice500g: "44.00",
        originalPrice1kg: "88.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/glyYwmbm.jpg",
        imageUrls: ["https://i.imgur.com/glyYwmbm.jpg"],
        weight: "450g",
        stock: 25,
        featured: false,
        discount: 36,
        rating: "4.5",
        reviews: 78,
        createdAt: new Date(),
      },
      {
        id: 30,
        name: "Doce Quebra-Queixo",
        description: "Tradicional doce mineiro feito com rapadura e amendoim. Crocante e saboroso, derrete na boca. Energia pura!",
        price500g: "36.90",
        price1kg: "73.80",
        originalPrice500g: "60.90",
        originalPrice1kg: "121.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/ded8MyOm.jpg",
        imageUrls: ["https://i.imgur.com/ded8MyOm.jpg"],
        weight: "300g",
        stock: 20,
        featured: false,
        discount: 39,
        rating: "4.7",
        reviews: 102,
        createdAt: new Date(),
      },
      {
        id: 31,
        name: "Doce de leite Dom",
        description: "Doce de leite premium da marca Dom. Textura aveludada e sabor incomparável. Produzido com leite selecionado.",
        price500g: "44.90",
        price1kg: "89.80",
        originalPrice500g: "80.90",
        originalPrice1kg: "161.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/lHpdysAm.jpg",
        imageUrls: ["https://i.imgur.com/lHpdysAm.jpg"],
        weight: "450g",
        stock: 10,
        featured: true,
        discount: 44,
        rating: "4.9",
        reviews: 189,
        createdAt: new Date(),
      },
      {
        id: 32,
        name: "Goiabada cremosa Tia Carla",
        description: "Goiabada cremosa artesanal da Tia Carla. Feita com goiabas maduras selecionadas, textura perfeita para acompanhar queijos.",
        price500g: "32.90",
        price1kg: "65.80",
        originalPrice500g: "60.90",
        originalPrice1kg: "121.80",
        category: "doces",
        imageUrl: "https://i.imgur.com/uJPxQ3Fm.jpg",
        imageUrls: ["https://i.imgur.com/uJPxQ3Fm.jpg"],
        weight: "400g",
        stock: 26,
        featured: true,
        discount: 46,
        rating: "4.8",
        reviews: 156,
        createdAt: new Date(),
      },
      {
        id: 33,
        name: "Doce de banana zero açúcar",
        description: "Doce de banana sem adição de açúcar, adoçado naturalmente. Ideal para dietas restritivas. Sabor autêntico da fruta.",
        price500g: "24.90",
        price1kg: "49.80",
        originalPrice500g: "40.00",
        originalPrice1kg: "80.00",
        category: "doces",
        imageUrl: "https://i.imgur.com/dOM2hiam.jpg",
        imageUrls: ["https://i.imgur.com/dOM2hiam.jpg"],
        weight: "350g",
        stock: 32,
        featured: false,
        discount: 37,
        rating: "4.6",
        reviews: 124,
        createdAt: new Date(),
      }
    ];

    this.products = initialProducts;
    this.nextProductId = 34;
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
      checkout500g: productData.checkout500g ?? null,
      checkout1kg: productData.checkout1kg ?? null,
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

  async getOrdersByTransactionId(transactionId: string): Promise<Order[]> {
    return this.orders.filter(order => order.blackCatTransactionId === transactionId);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order | undefined> {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.status = status;
    }
    return order;
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