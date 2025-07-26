import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

// Storage para Vercel (in-memory)
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

// Dados dos produtos - catálogo completo
const products: Product[] = [
  // QUEIJOS
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
    weight: "500g ou 1kg",
    stock: 15,
    featured: true,
    discount: 48,
    rating: "4.8",
    reviews: 127,
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Queijo Canastra",
    description: "Queijo maturado da Serra da Canastra, com sabor intenso e único. Patrimônio cultural brasileiro reconhecido pelo IPHAN.",
    price500g: "44.90",
    price1kg: "84.90",
    originalPrice500g: "59.90",
    originalPrice1kg: "119.80",
    category: "queijos",
    imageUrl: "https://i.imgur.com/bf7uIkJm.jpg",
    imageUrls: ["https://i.imgur.com/bf7uIkJm.jpg"],
    weight: "500g ou 1kg",
    stock: 12, 
    featured: true,
    discount: 25,
    rating: "4.9",
    reviews: 89,
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Queijo Coalho",
    description: "Queijo tradicional nordestino, ideal para grelhar. Textura firme e sabor marcante, perfeito para aperitivos e pratos especiais.",
    price500g: "28.90",
    price1kg: "54.90",
    originalPrice500g: "38.90",
    originalPrice1kg: "76.90",
    category: "queijos",
    imageUrl: "https://i.imgur.com/pn9vEYUm.jpg",
    imageUrls: ["https://i.imgur.com/pn9vEYUm.jpg"],
    weight: "500g ou 1kg", 
    stock: 20,
    featured: false,
    discount: 26,
    rating: "4.7",
    reviews: 156,
    createdAt: new Date()
  },
  {
    id: 4,
    name: "Queijo Minas Frescal",
    description: "Queijo fresco tradicional mineiro, de textura macia e sabor suave. Ideal para consumo direto ou em preparações culinárias.",
    price500g: "24.90",
    price1kg: "46.90",
    originalPrice500g: "32.90",
    originalPrice1kg: "64.90",
    category: "queijos",
    imageUrl: "https://i.imgur.com/XDzHo2xm.jpg",
    imageUrls: ["https://i.imgur.com/XDzHo2xm.jpg"],
    weight: "500g ou 1kg",
    stock: 25,
    featured: false,
    discount: 24,
    rating: "4.8",
    reviews: 203,
    createdAt: new Date()
  },
  {
    id: 5,
    name: "Queijo Prato",
    description: "Queijo semi-duro de sabor suave e textura lisa. Tradicional queijo brasileiro, perfeito para sanduíches e aperitivos.",
    price500g: "26.90",
    price1kg: "49.90", 
    originalPrice500g: "34.90",
    originalPrice1kg: "68.90",
    category: "queijos",
    imageUrl: "https://i.imgur.com/dYWr8Jym.jpg",
    imageUrls: ["https://i.imgur.com/dYWr8Jym.jpg"],
    weight: "500g ou 1kg",
    stock: 18,
    featured: false,
    discount: 23,
    rating: "4.6",
    reviews: 142,
    createdAt: new Date()
  },
  {
    id: 6,
    name: "Queijo Reino",
    description: "Queijo curado com casca natural, sabor intenso e marcante. Tradicional queijo português produzido em Minas Gerais.",
    price500g: "52.90",
    price1kg: "98.90",
    originalPrice500g: "68.90", 
    originalPrice1kg: "136.90",
    category: "queijos",
    imageUrl: "https://i.imgur.com/nB8wPg2m.jpg",
    imageUrls: ["https://i.imgur.com/nB8wPg2m.jpg"],
    weight: "500g ou 1kg",
    stock: 8,
    featured: true,
    discount: 23,
    rating: "4.9",
    reviews: 67,
    createdAt: new Date()
  },

  // DOCES
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
    createdAt: new Date()
  },
  {
    id: 22,
    name: "Doce de Leite Caseiro",
    description: "Doce de leite tradicional mineiro, cremoso e saboroso. Produzido com leite fresco e açúcar cristal, sem conservantes.",
    price500g: "29.90",
    price1kg: "56.90",
    originalPrice500g: "39.90",
    originalPrice1kg: "78.90",
    category: "doces",
    imageUrl: "https://i.imgur.com/HzLp3Qxm.jpg",
    imageUrls: ["https://i.imgur.com/HzLp3Qxm.jpg"],
    weight: "400g",
    stock: 22,
    featured: true,
    discount: 25,
    rating: "4.9",
    reviews: 185,
    createdAt: new Date()
  },
  {
    id: 23,
    name: "Goiabada Caseira",
    description: "Goiabada artesanal feita com goiabas selecionadas. Textura firme e sabor intenso da fruta. Perfeita com queijo.",
    price500g: "31.90",
    price1kg: "59.90",
    originalPrice500g: "42.90",
    originalPrice1kg: "84.90",
    category: "doces",
    imageUrl: "https://i.imgur.com/8K2p9Wzm.jpg",
    imageUrls: ["https://i.imgur.com/8K2p9Wzm.jpg"],
    weight: "380g",
    stock: 16,
    featured: true,
    discount: 26,
    rating: "4.8",
    reviews: 134,
    createdAt: new Date()
  },
  {
    id: 24,
    name: "Beijinho de Coco",
    description: "Beijinho tradicional feito com coco ralado fresco. Doce delicado e saboroso, perfeito para sobremesas e lanches.",
    price500g: "28.90",
    price1kg: "54.90",
    originalPrice500g: "36.90",
    originalPrice1kg: "72.90",
    category: "doces",
    imageUrl: "https://i.imgur.com/Cv8L4hWm.jpg",
    imageUrls: ["https://i.imgur.com/Cv8L4hWm.jpg"],
    weight: "300g",
    stock: 25,
    featured: false,
    discount: 22,
    rating: "4.7",
    reviews: 167,
    createdAt: new Date()
  },
  {
    id: 25,
    name: "Pé de Moleque",
    description: "Tradicional doce mineiro com amendoim torrado e rapadura. Crocante e saboroso, feito com ingredientes selecionados.",
    price500g: "26.90",
    price1kg: "49.90",
    originalPrice500g: "34.90",
    originalPrice1kg: "68.90",
    category: "doces",
    imageUrl: "https://i.imgur.com/9mR5Yxtm.jpg",
    imageUrls: ["https://i.imgur.com/9mR5Yxtm.jpg"],
    weight: "350g",
    stock: 20,
    featured: false,
    discount: 23,
    rating: "4.6",
    reviews: 123,
    createdAt: new Date()
  }
];

// Storage em memória
let cartItems: CartItem[] = [];
let orders: any[] = [];
let cartIdCounter = 1;
let orderIdCounter = 1;

// Função para criar pagamento PIX usando BlackCat
async function createPixPayment(paymentData: {
  valor: number;
  identificador: string;
  solicitacao_pagador: string;
}) {
  const apiKey = process.env.BLACKCAT_API_KEY;
  
  if (!apiKey) {
    console.warn('BLACKCAT_API_KEY não configurada, retornando PIX simulado');
    return {
      pix: {
        qrcode: 'PIX_CODE_PLACEHOLDER',
        chave: 'PIX_KEY_PLACEHOLDER'
      },
      identificador: paymentData.identificador
    };
  }

  try {
    const response = await fetch('https://api.blackcat.bio/pix/solicitar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`BlackCat API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    throw new Error(`Erro ao gerar código PIX: ${error.message}`);
  }
}

// Storage interface
const storage = {
  getProducts: async (): Promise<Product[]> => {
    return products;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    return products.find(p => p.id === id);
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return products.filter(p => p.category === category);
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    return products.filter(p => p.featured);
  },

  getCartItems: async (sessionId: string): Promise<CartItem[]> => {
    return cartItems
      .filter(item => item.sessionId === sessionId)
      .map(item => ({
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
    createdAt?: Date;
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
      // Criar transação PIX usando BlackCat API  
      const pixPayment = await createPixPayment({
        valor: parseFloat(orderData.total),
        identificador: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
        solicitacao_pagador: "Pagamento - Tábua de Minas"
      });

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

// Configurar Express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    const cartItems = await storage.getCartItems(sessionId);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    // Adicionar createdAt automaticamente
    const cartItemData = {
      ...req.body,
      createdAt: new Date()
    };
    const cartItem = await storage.addToCart(cartItemData);
    res.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.removeFromCart(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    // Buscar itens do carrinho
    const cartItems = await storage.getCartItems(req.body.sessionId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }
    
    const order = await storage.createOrder(req.body);
    
    // Limpar carrinho após criar pedido
    await storage.clearCart(req.body.sessionId);
    
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Webhook BlackCat
app.post('/api/webhooks/blackcat', async (req, res) => {
  try {
    const { transaction_id, status, event } = req.body;
    
    console.log('Webhook BlackCat recebido:', { transaction_id, status, event });
    
    if (!transaction_id) {
      return res.status(400).json({ error: 'Transaction ID é obrigatório' });
    }
    
    // Buscar pedidos por transaction_id
    const matchingOrders = await storage.getOrdersByTransactionId(transaction_id);
    
    if (matchingOrders.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    // Atualizar status dos pedidos encontrados
    for (const order of matchingOrders) {
      await storage.updateOrderStatus(order.id, status);
    }
    
    res.json({ 
      success: true, 
      message: `Status atualizado para ${matchingOrders.length} pedido(s)`,
      updatedOrders: matchingOrders.length
    });
  } catch (error) {
    console.error('Erro no webhook BlackCat:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota padrão para verificar se a API está funcionando
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Tábua de Minas API - Vercel',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Handler principal para Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug log
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  try {
    await app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}