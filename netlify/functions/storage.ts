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
    description: "Queijo artesanal tradicional de Minas Gerais com sabor único e textura cremosa. Produzido com leite fresco de fazendas selecionadas.",
    price500g: "33,90",
    price1kg: "67,80",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/minasbri_300x.jpg?v=1751561892"],
    weight: "500g - 1kg",
    stock: 15,
    featured: true,
    rating: "4.8",
    reviews: 234
  },
  {
    id: 2,
    name: "Queijo Canastra",
    description: "Queijo artesanal da Serra da Canastra, com sabor intenso e tradição centenária. Patrimônio cultural de Minas Gerais.",
    price500g: "45,90",
    price1kg: "89,80",
    category: "queijos",
    imageUrl: "https://tabuademinas.com/cdn/shop/files/canastra_300x.jpg?v=1751562234",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/canastra_300x.jpg?v=1751562234"],
    weight: "500g - 1kg",
    stock: 8,
    featured: true,
    rating: "4.9",
    reviews: 189
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
    imageUrl: "https://tabuademinas.com/cdn/shop/files/cocada_300x.jpg?v=1751562789",
    imageUrls: ["https://tabuademinas.com/cdn/shop/files/cocada_300x.jpg?v=1751562789"],
    weight: "500g - 1kg",
    stock: 25,
    featured: false,
    rating: "4.7",
    reviews: 156
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