// Simplified storage for Netlify
interface Product {
  id: number;
  name: string;
  description: string;
  price500g: string;
  price1kg: string;
  originalPrice500g?: string;
  originalPrice1kg?: string;
  category: string;
  imageUrl: string;
  imageUrls: string[];
  weight: string;
  stock: number;
  featured: boolean;
  discount?: number;
  rating: string;
  reviews: number;
  createdAt?: Date;
}

interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  size: string;
  price: string;
  product?: Product;
}

// In-memory storage (resets on each function call)
const products: Product[] = [
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

let cartItems: CartItem[] = [];
let cartIdCounter = 1;
let orders: any[] = [];
let orderIdCounter = 1;

export const storage = {
  getAllProducts: async (): Promise<Product[]> => {
    return products;
  },

  getCartItems: async (sessionId: string): Promise<CartItem[]> => {
    const items = cartItems.filter(item => item.sessionId === sessionId);
    // Add product details
    return items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)
    }));
  },

  addToCart: async (cartData: {
    sessionId: string;
    productId: number;
    quantity: number;
    size: string;
    price: string;
  }): Promise<CartItem> => {
    const newItem: CartItem = {
      id: cartIdCounter++,
      ...cartData
    };
    cartItems.push(newItem);
    return newItem;
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    cartItems = cartItems.filter(item => item.id !== itemId);
  },

  clearCart: async (sessionId: string): Promise<void> => {
    cartItems = cartItems.filter(item => item.sessionId !== sessionId);
  },

  createOrder: async (orderData: any): Promise<any> => {
    try {
      const blackCatApiKey = process.env.BLACKCAT_API_KEY;
      
      if (!blackCatApiKey) {
        console.warn('BLACKCAT_API_KEY não configurada, criando pedido sem PIX');
        const order = {
          id: orderIdCounter++,
          ...orderData,
          pixCode: 'PIX_CODE_PLACEHOLDER',
          blackCatTransactionId: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
          createdAt: new Date(),
          status: 'pending'
        };
        orders.push(order);
        return order;
      }

      // Criar transação PIX usando BlackCat API
      const pixResponse = await fetch('https://api.blackcat.bio/pix/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${blackCatApiKey}`
        },
        body: JSON.stringify({
          valor: parseFloat(orderData.total),
          identificador: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
          solicitacao_pagador: "Pagamento - Tábua de Minas"
        })
      });

      if (!pixResponse.ok) {
        throw new Error(`BlackCat API error: ${pixResponse.status}`);
      }

      const pixPayment = await pixResponse.json();

      const order = {
        id: orderIdCounter++,
        ...orderData,
        pixCode: pixPayment.pix.qrcode,
        pixKey: pixPayment.pix.chave,
        blackCatTransactionId: pixPayment.identificador,
        createdAt: new Date(),
        status: 'pending'
      };
      
      orders.push(order);
      return order;
    } catch (error) {
      console.error('Erro ao criar PIX:', error);
      throw new Error(`Erro ao gerar código PIX: ${error.message}`);
    }
  },

  getOrdersByTransactionId: async (transactionId: string): Promise<any[]> => {
    return orders.filter(order => order.blackCatTransactionId === transactionId);
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<any | undefined> => {
    const order = orders.find(order => order.id === orderId);
    if (order) {
      order.status = status;
    }
    return order;
  }
};
