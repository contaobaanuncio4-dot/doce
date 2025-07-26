// Produtos e dados para Netlify Functions
let products: any[] = [];
let cartItems: any[] = [];
let orders: any[] = [];

let productIdCounter = 1;
let cartIdCounter = 1;  
let orderIdCounter = 1;

// Inicializar produtos
const initializeProducts = () => {
  products = [
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
      reviews: 142,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Queijo Mussarela Artesanal",
      description: "Mussarela artesanal de textura macia e sabor marcante. Perfeita para pizzas, sanduíches ou consumo direto.",
      price500g: "28.90",
      price1kg: "55.90",
      originalPrice500g: "55.90",
      originalPrice1kg: "111.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/wMqvF3tm.jpg",
      imageUrls: ["https://i.imgur.com/wMqvF3tm.jpg"],
      weight: "500g",
      stock: 20,
      featured: false,
      discount: 48,
      rating: "4.7",
      reviews: 98,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Queijo Prato Curado",
      description: "Queijo prato curado especial, com consistência firme e sabor acentuado que marca presença em qualquer refeição.",
      price500g: "31.90",
      price1kg: "61.90",
      originalPrice500g: "61.90",
      originalPrice1kg: "123.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/Y7mKpXym.jpg",
      imageUrls: ["https://i.imgur.com/Y7mKpXym.jpg"],
      weight: "500g",
      stock: 18,
      featured: true,
      discount: 48,
      rating: "4.9",
      reviews: 156,
      createdAt: new Date(),
    },
    {
      id: 4,
      name: "Queijo Coalho Premium",
      description: "Queijo coalho premium direto do nordeste brasileiro. Ideal para grelhar ou consumir puro.",
      price500g: "35.90",
      price1kg: "69.90",
      originalPrice500g: "69.90",
      originalPrice1kg: "139.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/3nWvL2Km.jpg",
      imageUrls: ["https://i.imgur.com/3nWvL2Km.jpg"],
      weight: "500g",
      stock: 12,
      featured: false,
      discount: 48,
      rating: "4.8",
      reviews: 89,
      createdAt: new Date(),
    },
    {
      id: 5,
      name: "Queijo Canastra Artesanal",
      description: "Autêntico queijo Canastra, patrimônio de Minas Gerais. Sabor único que representa a tradição queijeira mineira.",
      price500g: "45.90",
      price1kg: "89.90",
      originalPrice500g: "89.90",
      originalPrice1kg: "179.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/hfC8Y7vm.jpg",
      imageUrls: ["https://i.imgur.com/hfC8Y7vm.jpg"],
      weight: "500g",
      stock: 10,
      featured: true,
      discount: 48,
      rating: "4.9",
      reviews: 203,
      createdAt: new Date(),
    },
    {
      id: 6,
      name: "Queijo Requeijão Cremoso",
      description: "Requeijão cremoso artesanal, textura aveludada e sabor suave. Feito com ingredientes selecionados.",
      price500g: "24.90",
      price1kg: "47.90",
      originalPrice500g: "47.90",
      originalPrice1kg: "95.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/ZQN5R8vm.jpg",
      imageUrls: ["https://i.imgur.com/ZQN5R8vm.jpg"],
      weight: "500g",
      stock: 25,
      featured: false,
      discount: 48,
      rating: "4.6",
      reviews: 76,
      createdAt: new Date(),
    },
    {
      id: 7,
      name: "Doce de Pingo de Leite com Castanha",
      description: "Tradicional doce mineiro de pingo de leite com castanhas selecionadas. Sabor caseiro da fazenda.",
      price500g: "29.90",
      price1kg: "57.90",
      originalPrice500g: "57.90",
      originalPrice1kg: "115.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/A3B9K5vm.jpg",
      imageUrls: ["https://i.imgur.com/A3B9K5vm.jpg"],
      weight: "400g",
      stock: 22,
      featured: true,
      discount: 48,
      rating: "4.8",
      reviews: 134,
      createdAt: new Date(),
    },
    {
      id: 8,
      name: "Doce de Cocada Tradicional",
      description: "Cocada tradicional com coco fresco e açúcar cristal. Crocante por fora, macia por dentro.",
      price500g: "26.90",
      price1kg: "51.90",
      originalPrice500g: "51.90",
      originalPrice1kg: "103.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/L8N2M4vm.jpg",
      imageUrls: ["https://i.imgur.com/L8N2M4vm.jpg"],
      weight: "350g",
      stock: 28,
      featured: false,
      discount: 48,
      rating: "4.7",
      reviews: 87,
      createdAt: new Date(),
    },
    {
      id: 9,
      name: "Doce de Leite Cremoso Premium",
      description: "Doce de leite cremoso feito no tacho de cobre. Consistência perfeita e sabor intenso.",
      price500g: "31.90",
      price1kg: "61.90",
      originalPrice500g: "61.90",
      originalPrice1kg: "123.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/R6T8W1vm.jpg",
      imageUrls: ["https://i.imgur.com/R6T8W1vm.jpg"],
      weight: "450g",
      stock: 35,
      featured: true,
      discount: 48,
      rating: "4.9",
      reviews: 198,
      createdAt: new Date(),
    },
    {
      id: 10,
      name: "Doce de Mamão com Coco",
      description: "Perfeita combinação de mamão verde com coco ralado fresco. Doce cristalizado no ponto.",
      price500g: "28.90",
      price1kg: "55.90",
      originalPrice500g: "55.90",
      originalPrice1kg: "111.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/V9X3C2vm.jpg",
      imageUrls: ["https://i.imgur.com/V9X3C2vm.jpg"],
      weight: "380g",
      stock: 18,
      featured: false,
      discount: 48,
      rating: "4.6",
      reviews: 92,
      createdAt: new Date(),
    },
    {
      id: 11,
      name: "Doce de Abóbora com Canela",
      description: "Doce de abóbora temperado com canela em pau. Receita colonial que atravessa gerações.",
      price500g: "25.90",
      price1kg: "49.90",
      originalPrice500g: "49.90",
      originalPrice1kg: "99.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/S5Y7J9vm.jpg",
      imageUrls: ["https://i.imgur.com/S5Y7J9vm.jpg"],
      weight: "420g",
      stock: 25,
      featured: false,
      discount: 48,
      rating: "4.5",
      reviews: 67,
      createdAt: new Date(),
    },
    {
      id: 12,
      name: "Doce Prestígio Mineiro",
      description: "Versão mineira do clássico prestígio. Doce de leite com coco ralado e cobertura de chocolate.",
      price500g: "24.90",
      price1kg: "47.90",
      originalPrice500g: "47.90",
      originalPrice1kg: "95.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/IdAa9ngm.jpg",
      imageUrls: ["https://i.imgur.com/IdAa9ngm.jpg"],
      weight: "300g",
      stock: 30,
      featured: true,
      discount: 48,
      rating: "4.9",
      reviews: 167,
      createdAt: new Date(),
    },
    {
      id: 13,
      name: "Doce Quebra-Queixo",
      description: "Tradicional doce mineiro crocante feito com amendoim torrado e rapadura. Resistir é impossível.",
      price500g: "22.90",
      price1kg: "43.90",
      originalPrice500g: "43.90",
      originalPrice1kg: "87.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/p6wwtEtm.jpg",
      imageUrls: ["https://i.imgur.com/p6wwtEtm.jpg"],
      weight: "250g",
      stock: 40,
      featured: false,
      discount: 48,
      rating: "4.7",
      reviews: 95,
      createdAt: new Date(),
    },
    {
      id: 14,
      name: "Banana Zero Açúcar",
      description: "Doce de banana sem adição de açúcar, adoçado naturalmente. Ideal para diabéticos e vida saudável.",
      price500g: "27.90",
      price1kg: "53.90",
      originalPrice500g: "53.90",
      originalPrice1kg: "107.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/WoKuC7Tm.jpg",
      imageUrls: ["https://i.imgur.com/WoKuC7Tm.jpg"],
      weight: "400g",
      stock: 20,
      featured: false,
      discount: 48,
      rating: "4.4",
      reviews: 63,
      createdAt: new Date(),
    },
    {
      id: 15,
      name: "Doce de Leite Dom",
      description: "Doce de leite especial da casa, cremosidade única e sabor marcante. Receita exclusiva da família.",
      price500g: "29.90",
      price1kg: "57.90",
      originalPrice500g: "57.90",
      originalPrice1kg: "115.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/7l56V5mm.jpg",
      imageUrls: ["https://i.imgur.com/7l56V5mm.jpg"],
      weight: "500g",
      stock: 25,
      featured: true,
      discount: 48,
      rating: "4.8",
      reviews: 134,
      createdAt: new Date(),
    },
    {
      id: 16,
      name: "Goiabada Tia Carla",
      description: "Goiabada artesanal da Tia Carla, feita com goiabas selecionadas. Textura perfeita e sabor inesquecível.",
      price500g: "26.90",
      price1kg: "51.90",
      originalPrice500g: "51.90",
      originalPrice1kg: "103.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/Y7mKpXym.jpg",
      imageUrls: ["https://i.imgur.com/Y7mKpXym.jpg"],
      weight: "450g",
      stock: 30,
      featured: false,
      discount: 48,
      rating: "4.6",
      reviews: 89,
      createdAt: new Date(),
    }
  ];
  
  productIdCounter = products.length + 1;
};

initializeProducts();

export const storage = {
  getProducts: async (): Promise<any[]> => {
    return products;
  },

  getProductById: async (id: number): Promise<any | undefined> => {
    return products.find(p => p.id === id);
  },

  getProductsByCategory: async (category: string): Promise<any[]> => {
    return products.filter(p => p.category === category);
  },

  getFeaturedProducts: async (): Promise<any[]> => {
    return products.filter(p => p.featured);
  },

  getCartItems: async (sessionId: string): Promise<any[]> => {
    return cartItems.filter(item => item.sessionId === sessionId);
  },

  addToCart: async (itemData: any): Promise<any> => {
    const newItem = {
      id: cartIdCounter++,
      ...itemData,
      createdAt: new Date()
    };
    cartItems.push(newItem);
    return newItem;
  },

  updateCartItem: async (id: number, quantity: number): Promise<any | undefined> => {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity = quantity;
      return cartItems[itemIndex];
    }
    return undefined;
  },

  removeFromCart: async (id: number): Promise<boolean> => {
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.id !== id);
    return cartItems.length < initialLength;
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

  getOrder: async (id: number): Promise<any | undefined> => {
    return orders.find(o => o.id === id);
  },

  getOrdersByCustomer: async (email: string): Promise<any[]> => {
    return orders.filter(o => o.customerEmail === email);
  }
};