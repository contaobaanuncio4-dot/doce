// Simplified storage for Netlify
interface Product {
  id: number;
  name: string;
  description: string;
  price500g: string;
  price1kg: string;
  category: string;
  imageUrl: string;
  imageUrls: string[];
  weight: string;
  stock: number;
  featured: boolean;
  rating: string;
  reviews: number;
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
    price500g: "33,90",
    price1kg: "33,90",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892"],
    weight: "250g",
    stock: 15,
    featured: true,
    rating: "4.8",
    reviews: 92
  },
  {
    id: 2,
    name: "Kit 4 Queijos de Alagoa-MG (parmesão)",
    description: "Kit especial com 4 queijos artesanais tipo parmesão de Alagoa, Minas Gerais. Perfeito para degustação e presente para amantes de queijo.",
    price500g: "53,90",
    price1kg: "53,90",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/kit4queijos_300x.png?v=1751561960"],
    weight: "Kit 4 unidades",
    stock: 8,
    featured: true,
    rating: "4.9",
    reviews: 65
  },
  {
    id: 3,
    name: "Queijo Canastra Meia Cura 1kg/1,2kg",
    description: "Queijo Canastra tradicional com meia cura, sabor marcante e textura firme. Direto da Serra da Canastra, região patrimônio da humanidade.",
    price500g: "69,00",
    price1kg: "69,00",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/4_300x.png?v=1751312328",
    imageUrls: [
      "https://tabuademinas.com/cdn/shop/files/4_300x.png?v=1751312328",
      "https://tabuademinas.com/cdn/shop/files/5_300x.png?v=1751312328"
    ],
    weight: "1kg/1,2kg",
    stock: 12,
    featured: true,
    rating: "4.9",
    reviews: 156
  },
  {
    id: 4,
    name: "Queijo Canastra Curado",
    description: "Queijo Canastra com cura especial, textura firme e sabor intenso. Ideal para quem aprecia queijos de personalidade marcante.",
    price500g: "79,00",
    price1kg: "79,00",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/6_300x.png?v=1751312328",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/6_300x.png?v=1751312328"],
    weight: "1kg",
    stock: 10,
    featured: true,
    rating: "4.8",
    reviews: 134
  },
  {
    id: 5,
    name: "Queijo Canastra Fresco 1kg",
    description: "Queijo Canastra fresco, textura macia e sabor suave. Perfeito para quem busca o sabor autêntico da Serra da Canastra.",
    price500g: "59,00",
    price1kg: "59,00",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/7_300x.png?v=1751312328",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/7_300x.png?v=1751312328"],
    weight: "1kg",
    stock: 18,
    featured: false,
    rating: "4.7",
    reviews: 89
  },
  {
    id: 6,
    name: "Queijo Reino 1kg/1,5kg",
    description: "Queijo Reino artesanal com sabor acentuado e textura firme. Tradição mineira para paladares exigentes.",
    price500g: "75,00",
    price1kg: "75,00",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/8_300x.png?v=1751312328",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/8_300x.png?v=1751312328"],
    weight: "1kg/1,5kg",
    stock: 14,
    featured: true,
    rating: "4.6",
    reviews: 72
  },
  {
    id: 7,
    name: "Doce de Pingo de Leite com Castanha de Caju",
    description: "Delicioso doce de pingo de leite artesanal com castanha de caju torrada. Cremoso e saboroso, uma especialidade mineira irresistível.",
    price500g: "34,90",
    price1kg: "63,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/taq_700x.png?v=1751478341",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/taq_700x.png?v=1751478341"],
    weight: "500g - 1kg",
    stock: 20,
    featured: true,
    rating: "4.9",
    reviews: 203
  },
  {
    id: 8,
    name: "Doce de Cocada com Abacaxi",
    description: "Cocada artesanal com pedaços de abacaxi fresco. Combinação tropical perfeita, doce tradicional com toque refrescante.",
    price500g: "33,90",
    price1kg: "61,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/abacaxi_700x.png?v=1751475432",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/abacaxi_700x.png?v=1751475432"],
    weight: "500g - 1kg",
    stock: 25,
    featured: true,
    rating: "4.8",
    reviews: 156
  },
  {
    id: 9,
    name: "Doce de Cocada com Maracujá",
    description: "Cocada artesanal com polpa de maracujá natural. Sabor tropical e refrescante, perfeita combinação doce e azedinho.",
    price500g: "32,90",
    price1kg: "59,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/maracuja_700x.png?v=1751475750",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/maracuja_700x.png?v=1751475750"],
    weight: "500g - 1kg",
    stock: 22,
    featured: true,
    rating: "4.7",
    reviews: 89
  },
  {
    id: 10,
    name: "Doce de Abóbora com Coco",
    description: "Doce tradicional de abóbora com coco ralado, textura cremosa e sabor caseiro. Receita familiar passada por gerações.",
    price500g: "32,90",
    price1kg: "59,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/12_300x.png?v=1751312328",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/12_300x.png?v=1751312328"],
    weight: "500g - 1kg",
    stock: 22,
    featured: true,
    rating: "4.7",
    reviews: 156
  },
  {
    id: 11,
    name: "Doce de Leite Tradicional",
    description: "Doce de leite artesanal preparado no tacho de cobre. Cremoso e saboroso, perfeito para sobremesas ou consumo puro.",
    price500g: "22,90",
    price1kg: "39,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/adssdasd_700x.png?v=1751314259",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/adssdasd_700x.png?v=1751314259", "https://tabuademinas.com/cdn/shop/files/dadas_700x.png?v=1751314249"],
    weight: "500g - 1kg",
    stock: 30,
    featured: true,
    rating: "4.9",
    reviews: 312
  },
  {
    id: 12,
    name: "Doce de Leite com Café",
    description: "Doce de leite especial com café torrado e moído. Combinação perfeita para os amantes de café, sabor intenso e cremoso.",
    price500g: "26,90",
    price1kg: "47,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/a1_300x.png?v=1751314696",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/a1_300x.png?v=1751314696"],
    weight: "500g - 1kg",
    stock: 18,
    featured: true,
    rating: "4.8",
    reviews: 198
  },
  {
    id: 13,
    name: "Doce de Pingo de Leite com Amendoim",
    description: "Tradicional doce de pingo de leite com amendoim torrado. Textura cremosa e sabor intenso, uma especialidade mineira premium.",
    price500g: "57,90",
    price1kg: "109,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/36_700x.png?v=1751313980",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/36_700x.png?v=1751313980", "https://tabuademinas.com/cdn/shop/files/37_700x.png?v=1751313980"],
    weight: "500g - 1kg",
    stock: 12,
    featured: true,
    rating: "4.9",
    reviews: 167
  },
  {
    id: 14,
    name: "Doce de Cocada com Ameixa",
    description: "Cocada artesanal com ameixas secas selecionadas. Combinação única de texturas e sabores, doce sofisticado e saboroso.",
    price500g: "32,90",
    price1kg: "59,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_700x.png?v=1751475618",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/1_20935611-0971-4452-982f-143ed99d0ecb_700x.png?v=1751475618", "https://tabuademinas.com/cdn/shop/files/2_4de1745d-9583-455e-a299-d0ac9614aba2_700x.png?v=1751475618"],
    weight: "500g - 1kg",
    stock: 20,
    featured: false,
    rating: "4.6",
    reviews: 94
  },
  {
    id: 15,
    name: "Doce de Abóbora com Coco",
    description: "Doce de abóbora tradicional com coco ralado fresco. Preparado no tacho de cobre seguindo receita centenária mineira.",
    price500g: "27,90",
    price1kg: "49,90",
    category: "doces",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/14_700x.png?v=1751314396",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/14_700x.png?v=1751314396", "https://tabuademinas.com/cdn/shop/files/13_700x.png?v=1751314396"],
    weight: "500g - 1kg",
    stock: 22,
    featured: true,
    rating: "4.7",
    reviews: 156
  },
  {
    id: 28,
    name: "Doce Prestígio Mineiro",
    description: "Doce especial tipo prestígio com coco e chocolate. Receita mineira tradicional com toque especial, irresistível e cremoso.",
    price500g: "24,90",
    price1kg: "44,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/IdAa9ng.png",
    imageUrls: ["https://i.imgur.com/IdAa9ng.png"],
    weight: "500g - 1kg",
    stock: 18,
    featured: true,
    rating: "4.8",
    reviews: 142
  },
  {
    id: 29,
    name: "Doce Quebra-Queixo",
    description: "Tradicional doce quebra-queixo mineiro com amendoim torrado. Textura crocante e sabor intenso, especialidade da casa.",
    price500g: "36,90",
    price1kg: "67,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/ded8MyO.png",
    imageUrls: ["https://i.imgur.com/ded8MyO.png"],
    weight: "500g - 1kg",
    stock: 15,
    featured: true,
    rating: "4.9",
    reviews: 198
  },
  {
    id: 30,
    name: "Doce de Banana Zero Açúcar",
    description: "Doce de banana especial sem açúcar, adoçado naturalmente. Opção saudável sem perder o sabor tradicional mineiro.",
    price500g: "24,90",
    price1kg: "44,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/dOM2hia.png",
    imageUrls: ["https://i.imgur.com/dOM2hia.png"],
    weight: "500g - 1kg",
    stock: 20,
    featured: false,
    rating: "4.6",
    reviews: 87
  },
  {
    id: 31,
    name: "Doce de Leite Dom",
    description: "Doce de leite premium da linha Dom, preparado com leite selecionado. Cremosidade e sabor incomparáveis, produto gourmet.",
    price500g: "44,90",
    price1kg: "84,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/lHpdysA.png",
    imageUrls: ["https://i.imgur.com/lHpdysA.png"],
    weight: "500g - 1kg",
    stock: 12,
    featured: true,
    rating: "4.9",
    reviews: 156
  },
  {
    id: 32,
    name: "Goiabada Cremosa Tia Carla",
    description: "Goiabada cremosa artesanal da Tia Carla com goiabas selecionadas. Textura suave e sabor autêntico, tradição familiar.",
    price500g: "32,90",
    price1kg: "59,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/uJPxQ3F.png",
    imageUrls: ["https://i.imgur.com/uJPxQ3F.png"],
    weight: "500g - 1kg",
    stock: 25,
    featured: true,
    rating: "4.8",
    reviews: 203
  },
  {
    id: 33,
    name: "Doce de Cocada com Maracujá",
    description: "Cocada artesanal com polpa de maracujá fresco. Combinação tropical única, doce refrescante com acidez equilibrada do maracujá.",
    price500g: "32,90",
    price1kg: "59,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/p6wwtEt.png",
    imageUrls: ["https://i.imgur.com/p6wwtEt.png"],
    weight: "500g - 1kg",
    stock: 16,
    featured: true,
    rating: "4.7",
    reviews: 134
  },
  {
    id: 34,
    name: "Doce Casadinho",
    description: "Tradicional doce casadinho mineiro com duas camadas de sabores. Combinação perfeita de doce de leite e cocada, receita centenária.",
    price500g: "27,90",
    price1kg: "49,90",
    category: "doces",
    imageUrl: "https://i.imgur.com/WoKuC7T.png",
    imageUrls: ["https://i.imgur.com/WoKuC7T.png"],
    weight: "500g - 1kg",
    stock: 22,
    featured: true,
    rating: "4.8",
    reviews: 176
  }
];

let cartItems: CartItem[] = [];
let cartIdCounter = 1;

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
    // Simplified order creation for demo
    return {
      id: Math.floor(Math.random() * 10000),
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    };
  }
};