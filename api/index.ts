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
  checkout500g?: string;
  checkout1kg?: string;
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
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "500g ou 1kg",
    stock: 15,
    featured: true,
    discount: 48,
    rating: "4.8",
    reviews: 127,
    checkout500g: "https://pay.tabuademinas.fun/6886ed52ed44f872dda1bc08",
    checkout1kg: "https://pay.tabuademinas.fun/6886ed70cbb7096b50749f31",
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Kit 4 Queijos de Alagoa-MG",
    description: "Kit especial com 4 queijos artesanais tipo parmesão de Alagoa, Minas Gerais. Perfeito para degustação e presente para amantes de queijo.",
    price500g: "53.90",
    price1kg: "113.47",
    originalPrice500g: "100.90",
    originalPrice1kg: "212.42",
    category: "queijos",
    imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "475g",
    stock: 8,
    featured: true,
    discount: 46,
    rating: "4.9",
    reviews: 65,
    checkout500g: "https://pay.tabuademinas.fun/6886ed97cbb7096b50749f69",
    checkout1kg: "https://pay.tabuademinas.fun/6886edc8ed44f872dda1bc50",
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Queijo Canastra Meia Cura",
    description: "Queijo Canastra tradicional da Serra da Canastra, com maturação controlada. Sabor intenso e textura única, patrimônio cultural brasileiro.",
    price500g: "44.90",
    price1kg: "84.90",
    originalPrice500g: "59.90",
    originalPrice1kg: "119.80",
    category: "queijos",
    imageUrl: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "500g ou 1kg",
    stock: 12,
    featured: true,
    discount: 25,
    rating: "4.9",
    reviews: 89,
    checkout500g: "https://pay.tabuademinas.fun/6886d638cbb7096b507489af",
    checkout1kg: "https://pay.tabuademinas.fun/6886d64acbb7096b507489dc",
    createdAt: new Date()
  },
  {
    id: 4,
    name: "Queijo Figueira",
    description: "Queijo artesanal da região de Figueira, Minas Gerais. Sabor suave e textura cremosa, perfeito para degustação.",
    price500g: "38.90",
    price1kg: "74.90",
    originalPrice500g: "48.90",
    originalPrice1kg: "94.90",
    category: "queijos",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "500g ou 1kg",
    stock: 15,
    featured: false,
    discount: 20,
    rating: "4.7",
    reviews: 156,
    checkout500g: "https://pay.tabuademinas.fun/6886d58eed44f872dda1a862",
    checkout1kg: "https://pay.tabuademinas.fun/6886d5b1ed44f872dda1a8a2",
    createdAt: new Date()
  },
  {
    id: 5,
    name: "Queijo Tipo Camembert",
    description: "Queijo tipo Camembert artesanal, com casca branca e interior cremoso. Sabor delicado e textura suave.",
    price500g: "42.90",
    price1kg: "82.90",
    originalPrice500g: "52.90",
    originalPrice1kg: "102.90",
    category: "queijos",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "500g ou 1kg",
    stock: 12,
    featured: false,
    discount: 19,
    rating: "4.8",
    reviews: 98,
    checkout500g: "https://pay.tabuademinas.fun/6886d5e3cbb7096b5074896a",
    checkout1kg: "https://pay.tabuademinas.fun/6886d5cbcbb7096b50748931",
    createdAt: new Date()
  },
  {
    id: 6,
    name: "Queijo Gorgonzola Duplo Creme",
    description: "Queijo Gorgonzola artesanal com duplo creme, sabor intenso e textura cremosa. Perfeito para molhos e aperitivos.",
    price500g: "48.90",
    price1kg: "94.90",
    originalPrice500g: "58.90",
    originalPrice1kg: "114.90",
    category: "queijos",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "500g ou 1kg",
    stock: 10,
    featured: true,
    discount: 17,
    rating: "4.9",
    reviews: 67,
    checkout500g: "https://pay.tabuademinas.fun/6886d60eed44f872dda1a937",
    checkout1kg: "https://pay.tabuademinas.fun/6886d625ed44f872dda1a95d",
    createdAt: new Date()
  },

  // DOCES
  {
    id: 21,
    name: "Doce de Pingo de Leite com Amendoim",
    description: "Doce de pingo de leite artesanal com amendoim torrado. Textura cremosa e sabor único, receita tradicional mineira.",
    price500g: "28.90",
    price1kg: "54.90",
    originalPrice500g: "38.90",
    originalPrice1kg: "76.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "400g",
    stock: 20,
    featured: true,
    discount: 26,
    rating: "4.8",
    reviews: 156,
    checkout500g: "https://pay.tabuademinas.fun/6886ca54cbb7096b507479e0",
    checkout1kg: "https://pay.tabuademinas.fun/6886ca6aed44f872dda1984e",
    createdAt: new Date()
  },
  {
    id: 22,
    name: "Doce de Cocada com Abacaxi",
    description: "Cocada artesanal com pedaços de abacaxi fresco. Textura macia e sabor tropical irresistível. Receita de família.",
    price500g: "33.90",
    price1kg: "67.80",
    originalPrice500g: "46.00",
    originalPrice1kg: "92.00",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "350g",
    stock: 18,
    featured: false,
    discount: 26,
    rating: "4.6",
    reviews: 98,
    checkout500g: "https://pay.tabuademinas.fun/6886ca05cbb7096b50747965",
    checkout1kg: "https://pay.tabuademinas.fun/6886ca2eed44f872dda197d4",
    createdAt: new Date()
  },
  {
    id: 23,
    name: "Doce Prestígio mineiro",
    description: "Doce prestígio artesanal mineiro, com coco ralado e chocolate. Sabor único e textura perfeita.",
    price500g: "32.90",
    price1kg: "62.90",
    originalPrice500g: "42.90",
    originalPrice1kg: "82.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "380g",
    stock: 16,
    featured: true,
    discount: 23,
    rating: "4.8",
    reviews: 134,
    checkout500g: "https://pay.tabuademinas.fun/6886c923cbb7096b507477fb",
    checkout1kg: "https://pay.tabuademinas.fun/6886c955cbb7096b50747857",
    createdAt: new Date()
  },
  {
    id: 24,
    name: "Doce de Cocada com Maracujá",
    description: "Cocada artesanal com maracujá fresco. Sabor tropical único e textura macia, perfeita para sobremesas.",
    price500g: "31.90",
    price1kg: "59.90",
    originalPrice500g: "41.90",
    originalPrice1kg: "72.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "300g",
    stock: 25,
    featured: false,
    discount: 22,
    rating: "4.7",
    reviews: 167,
    checkout500g: "https://pay.tabuademinas.fun/6886c8f7ed44f872dda195d0",
    checkout1kg: "https://pay.tabuademinas.fun/6886c909ed44f872dda19605",
    createdAt: new Date()
  },
  {
    id: 25,
    name: "Doce casadinho",
    description: "Doce casadinho tradicional mineiro, com coco ralado e leite condensado. Sabor único e textura perfeita.",
    price500g: "29.90",
    price1kg: "56.90",
    originalPrice500g: "38.90",
    originalPrice1kg: "76.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "350g",
    stock: 20,
    featured: false,
    discount: 23,
    rating: "4.6",
    reviews: 123,
    checkout500g: "https://pay.tabuademinas.fun/6886c8afcbb7096b50747730",
    checkout1kg: "https://pay.tabuademinas.fun/6886c8c6cbb7096b5074774c",
    createdAt: new Date()
  },
  {
    id: 26,
    name: "Doce de leite",
    description: "Doce de leite tradicional mineiro, cremoso e saboroso. Produzido com leite fresco e açúcar cristal, sem conservantes.",
    price500g: "29.90",
    price1kg: "56.90",
    originalPrice500g: "39.90",
    originalPrice1kg: "78.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "400g",
    stock: 22,
    featured: true,
    discount: 25,
    rating: "4.9",
    reviews: 185,
    checkout500g: "https://pay.tabuademinas.fun/6886c86ecbb7096b507476e5",
    checkout1kg: "https://pay.tabuademinas.fun/6886c88fed44f872dda19466",
    createdAt: new Date()
  },
  {
    id: 27,
    name: "Doce de leite com café",
    description: "Doce de leite com café artesanal, sabor único e textura cremosa. Perfeito para acompanhar café ou chá.",
    price500g: "31.90",
    price1kg: "59.90",
    originalPrice500g: "41.90",
    originalPrice1kg: "79.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "380g",
    stock: 18,
    featured: false,
    discount: 24,
    rating: "4.7",
    reviews: 134,
    checkout500g: "https://pay.tabuademinas.fun/6886c837cbb7096b5074769f",
    checkout1kg: "https://pay.tabuademinas.fun/6886c854ed44f872dda19376",
    createdAt: new Date()
  },
  {
    id: 28,
    name: "Doce de Abóbora com Coco",
    description: "Doce de abóbora com coco ralado, sabor único e textura macia. Receita tradicional mineira.",
    price500g: "27.90",
    price1kg: "52.90",
    originalPrice500g: "36.90",
    originalPrice1kg: "69.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "350g",
    stock: 16,
    featured: false,
    discount: 24,
    rating: "4.6",
    reviews: 98,
    checkout500g: "https://pay.tabuademinas.fun/6886c6fecbb7096b50747452",
    checkout1kg: "https://pay.tabuademinas.fun/6886c782ed44f872dda191bd",
    createdAt: new Date()
  },
  {
    id: 29,
    name: "Doce de Cocada com Ameixa",
    description: "Cocada artesanal com ameixa seca. Sabor único e textura macia, perfeita para sobremesas.",
    price500g: "33.90",
    price1kg: "64.90",
    originalPrice500g: "43.90",
    originalPrice1kg: "84.90",
    category: "doces",
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    imageUrls: ["https://images.unsplash.com/photo-1609501676725-7186f506c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
    weight: "320g",
    stock: 14,
    featured: false,
    discount: 23,
    rating: "4.5",
    reviews: 87,
    checkout500g: "https://pay.tabuademinas.fun/6886c649cbb7096b507472aa",
    checkout1kg: "https://pay.tabuademinas.fun/6886c7a3ed44f872dda19222",
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

app.get('/api/products/featured', async (req, res) => {
  try {
    const featuredProducts = await storage.getFeaturedProducts();
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
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
