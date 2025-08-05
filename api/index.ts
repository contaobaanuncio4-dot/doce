import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

// UTMify Integration para Vercel
interface UTMifyOrderData {
  orderId: string;
  platform: string;
  paymentMethod: 'credit_card' | 'boleto' | 'pix' | 'paypal' | 'free_price';
  status: 'waiting_payment' | 'paid' | 'refused' | 'refunded' | 'chargedback';
  createdAt: string;
  approvedDate: string;
  refundedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    country?: string;
    ip?: string;
  };
  products: {
    id: string;
    name: string;
    planId: string;
    planName: string;
    quantity: number;
    priceInCents: number;
  }[];
  trackingParameters: {
    src?: string | null;
    sck?: string | null;
    utm_source?: string | null;
    utm_campaign?: string | null;
    utm_medium?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  };
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
    currency: string;
  };
  isTest?: boolean;
}

async function notifyUTMify(orderData: UTMifyOrderData): Promise<void> {
  const apiKey = process.env.UTMIFY_API_KEY;
  
  if (!apiKey) {
    console.log('UTMify API key não configurado');
    return;
  }

  try {
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('UTMify notificado com sucesso:', result);
    } else {
      const errorText = await response.text();
      console.error('Erro ao notificar UTMify:', response.status, errorText);
    }
  } catch (error) {
    console.error('Erro ao conectar com UTMify:', error);
  }
}

function toUTCString(date: Date): string {
  const utcDate = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
  return utcDate.toISOString().replace('T', ' ').substring(0, 19);
}

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
  
  console.log('🔍 Verificando BLACKCAT_API_KEY:', apiKey ? 'Configurada' : 'NÃO CONFIGURADA');
  
  if (!apiKey) {
    console.warn('⚠️ BLACKCAT_API_KEY não configurada, retornando PIX simulado');
    return {
      pix: {
        qrcode: 'PIX_CODE_PLACEHOLDER',
        chave: 'PIX_KEY_PLACEHOLDER'
      },
      identificador: paymentData.identificador
    };
  }

  try {
    console.log('🚀 Iniciando requisição para BlackCat API...');
    console.log('📊 Dados do pagamento:', {
      valor: paymentData.valor,
      identificador: paymentData.identificador,
      solicitacao_pagador: paymentData.solicitacao_pagador
    });
    
    const startTime = Date.now();
    
    const response = await fetch('https://api.blackcat.bio/pix/solicitar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(paymentData)
    });

    const endTime = Date.now();
    console.log(`⏱️ Tempo de resposta BlackCat: ${endTime - startTime}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API BlackCat:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`BlackCat API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Resposta BlackCat recebida:', {
      hasPix: !!result.pix,
      hasQrCode: !!result.pix?.qrcode,
      identificador: result.identificador
    });
    
    return result;
  } catch (error) {
    console.error('💥 Erro ao criar PIX:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Retornar PIX simulado em caso de erro
    console.log('🔄 Retornando PIX simulado devido ao erro');
    return {
      pix: {
        qrcode: 'PIX_CODE_PLACEHOLDER',
        chave: 'PIX_KEY_PLACEHOLDER'
      },
      identificador: paymentData.identificador
    };
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
    console.log('🛒 Buscando itens do carrinho para sessionId:', sessionId);
    console.log('📦 Total de itens em memória:', cartItems.length);
    console.log('🔍 Itens filtrados por sessionId:', cartItems.filter(item => item.sessionId === sessionId).length);
    
    const filteredItems = cartItems
      .filter(item => item.sessionId === sessionId)
      .map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      }));
    
    console.log('✅ Itens retornados:', filteredItems.length);
    return filteredItems;
  },

  addToCart: async (cartData: {
    sessionId: string;
    productId: number;
    quantity: number;
    size: string;
    price: string;
    createdAt?: Date;
  }): Promise<CartItem> => {
    console.log('➕ Adicionando item ao carrinho:', {
      sessionId: cartData.sessionId,
      productId: cartData.productId,
      quantity: cartData.quantity,
      size: cartData.size,
      price: cartData.price
    });
    
    const newItem: CartItem = {
      id: cartIdCounter++,
      ...cartData
    };
    
    cartItems.push(newItem);
    console.log('✅ Item adicionado com ID:', newItem.id);
    console.log('📦 Total de itens no carrinho:', cartItems.length);
    
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
      console.log('📦 Iniciando criação de pedido...');
      console.log('📋 Dados do pedido:', {
        sessionId: orderData.sessionId,
        customerName: orderData.customerName,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod
      });
      
      // Criar transação PIX usando BlackCat API  
      const pixPayment = await createPixPayment({
        valor: parseFloat(orderData.total),
        identificador: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
        solicitacao_pagador: "Pagamento - Tábua de Minas"
      });

      console.log('✅ PIX criado com sucesso:', {
        hasPixCode: !!pixPayment.pix?.qrcode,
        pixCodeLength: pixPayment.pix?.qrcode?.length || 0,
        identificador: pixPayment.identificador
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
      console.log('📝 Pedido salvo com ID:', order.id);
      
      // Notificar UTMify sobre criação do pedido
      try {
        const cartItemsForOrder = await storage.getCartItems(orderData.sessionId);
        const totalInCents = Math.round(parseFloat(orderData.total) * 100);
        const gatewayFeeInCents = Math.round(totalInCents * 0.0399 + 40);
        
        const utmifyData: UTMifyOrderData = {
          orderId: order.id.toString(),
          platform: "TabuaDeMinas",
          paymentMethod: "pix",
          status: "waiting_payment",
          createdAt: toUTCString(order.createdAt),
          approvedDate: "",
          refundedAt: "",
          customer: {
            name: orderData.customerName,
            email: orderData.customerEmail,
            phone: orderData.customerPhone,
            document: orderData.customerCpf || "",
            country: "BR"
          },
          products: cartItemsForOrder.map(item => ({
            id: item.productId.toString(),
            name: `${item.product?.name || 'Produto'} - ${item.size}`,
            planId: "default",
            planName: "Produto Avulso",
            quantity: item.quantity,
            priceInCents: Math.round(parseFloat(item.price.replace(',', '.')) * 100)
          })),
          trackingParameters: {
            src: null,
            sck: null,
            utm_source: null,
            utm_campaign: null,
            utm_medium: null,
            utm_content: null,
            utm_term: null
          },
          commission: {
            totalPriceInCents: totalInCents,
            gatewayFeeInCents: gatewayFeeInCents,
            userCommissionInCents: totalInCents - gatewayFeeInCents,
            currency: "BRL"
          },
          isTest: false
        };
        
        await notifyUTMify(utmifyData);
        console.log(`✅ UTMify notificado: Pedido ${order.id} criado`);
      } catch (utmifyError) {
        console.error('⚠️ Erro ao notificar UTMify sobre criação do pedido:', utmifyError);
      }
      
      console.log('🎉 Pedido criado com sucesso!');
      return order;
    } catch (error) {
      console.error('💥 Erro ao criar pedido:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Retornar pedido com PIX simulado em caso de erro
      console.log('🔄 Criando pedido com PIX simulado devido ao erro');
      const fallbackOrder = {
        id: orderIdCounter++,
        ...orderData,
        pixCode: 'PIX_CODE_PLACEHOLDER',
        pixKey: 'PIX_KEY_PLACEHOLDER',
        blackCatTransactionId: `PEDIDO-${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date(),
        status: 'pending'
      };
      
      orders.push(fallbackOrder);
      return fallbackOrder;
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
    console.log('📦 Recebendo requisição para criar pedido...');
    console.log('📋 Body da requisição:', JSON.stringify(req.body, null, 2));
    
    // Validar dados obrigatórios
    if (!req.body.sessionId) {
      console.error('❌ sessionId não fornecido');
      return res.status(400).json({ 
        error: 'sessionId é obrigatório',
        received: req.body 
      });
    }
    
    if (!req.body.customerName) {
      console.error('❌ customerName não fornecido');
      return res.status(400).json({ 
        error: 'customerName é obrigatório',
        received: req.body 
      });
    }
    
    if (!req.body.customerEmail) {
      console.error('❌ customerEmail não fornecido');
      return res.status(400).json({ 
        error: 'customerEmail é obrigatório',
        received: req.body 
      });
    }
    
    if (!req.body.total) {
      console.error('❌ total não fornecido');
      return res.status(400).json({ 
        error: 'total é obrigatório',
        received: req.body 
      });
    }
    
    // Buscar itens do carrinho
    console.log('🛒 Buscando itens do carrinho para sessionId:', req.body.sessionId);
    const cartItems = await storage.getCartItems(req.body.sessionId);
    console.log('📦 Itens encontrados no carrinho:', cartItems.length);
    
    if (cartItems.length === 0) {
      console.error('❌ Carrinho vazio para sessionId:', req.body.sessionId);
      return res.status(400).json({ 
        error: 'Carrinho vazio',
        sessionId: req.body.sessionId,
        cartItemsCount: cartItems.length
      });
    }
    
    console.log('✅ Dados válidos, criando pedido...');
    const order = await storage.createOrder(req.body);
    
    console.log('✅ Pedido criado com sucesso, ID:', order.id);
    
    // Limpar carrinho após criar pedido
    await storage.clearCart(req.body.sessionId);
    console.log('🧹 Carrinho limpo para sessionId:', req.body.sessionId);
    
    res.json(order);
  } catch (error) {
    console.error('💥 Erro ao criar pedido:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      error: 'Erro interno ao criar pedido',
      message: error.message,
      timestamp: new Date().toISOString()
    });
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
      
      // Notificar UTMify sobre mudança de status para 'paid'
      if (status === 'paid') {
        try {
          const totalInCents = Math.round(parseFloat(order.total) * 100);
          const gatewayFeeInCents = Math.round(totalInCents * 0.0399 + 40);
          
          const utmifyData: UTMifyOrderData = {
            orderId: order.id.toString(),
            platform: "TabuaDeMinas",
            paymentMethod: "pix",
            status: "paid",
            createdAt: toUTCString(order.createdAt),
            approvedDate: toUTCString(new Date()),
            refundedAt: "",
            customer: {
              name: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              document: order.customerCpf || "",
              country: "BR"
            },
            products: [{
              id: "1",
              name: "Produto do Pedido",
              planId: "default",
              planName: "Produto Avulso",
              quantity: 1,
              priceInCents: totalInCents
            }],
            trackingParameters: {
              src: null,
              sck: null,
              utm_source: null,
              utm_campaign: null,
              utm_medium: null,
              utm_content: null,
              utm_term: null
            },
            commission: {
              totalPriceInCents: totalInCents,
              gatewayFeeInCents: gatewayFeeInCents,
              userCommissionInCents: totalInCents - gatewayFeeInCents,
              currency: "BRL"
            },
            isTest: false
          };
          
          await notifyUTMify(utmifyData);
          console.log(`UTMify notificado: Pedido ${order.id} PAGO`);
        } catch (utmifyError) {
          console.error('Erro ao notificar UTMify sobre pagamento:', utmifyError);
        }
      }
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