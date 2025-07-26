// In-memory storage for Netlify Functions
let products: any[] = [];
let cartItems: any[] = [];
let orders: any[] = [];

let productIdCounter = 1;
let cartIdCounter = 1;
let orderIdCounter = 1;

// Initialize products data
const initializeProducts = () => {
  products = [
    {
      id: 1,
      name: "Queijo MinasBri",
      description: "Queijo minas frescal artesanal, cremoso e suave. Produzido com leite fresco da região de Minas Gerais. Tradição e qualidade em cada fatia.",
      price500g: "33.90",
      price1kg: "67.80",
      originalPrice500g: "45.90",
      originalPrice1kg: "91.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/hfC8Y7vm.jpg",
      imageUrls: ["https://i.imgur.com/hfC8Y7vm.jpg"],
      weight: "500g",
      stock: 25,
      featured: true,
      discount: 26,
      rating: "4.8",
      reviews: 142,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Queijo Mussarela Artesanal",
      description: "Mussarela artesanal de primeira qualidade. Textura macia e sabor marcante. Perfeita para pizzas, sanduíches ou para consumo direto.",
      price500g: "28.90",
      price1kg: "57.80",
      originalPrice500g: "38.90",
      originalPrice1kg: "77.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/ZQN5R8vm.jpg",
      imageUrls: ["https://i.imgur.com/ZQN5R8vm.jpg"],
      weight: "500g",
      stock: 30,
      featured: false,
      discount: 25,
      rating: "4.7",
      reviews: 98,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Queijo Prato Curado",
      description: "Queijo prato curado por tempo ideal para desenvolver sabor único. Consistência firme e sabor acentuado que marca presença em qualquer refeição.",
      price500g: "31.90",
      price1kg: "63.80",
      originalPrice500g: "42.90",
      originalPrice1kg: "85.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/8K2pN1vm.jpg",
      imageUrls: ["https://i.imgur.com/8K2pN1vm.jpg"],
      weight: "500g",
      stock: 20,
      featured: true,
      discount: 25,
      rating: "4.9",
      reviews: 156,
      createdAt: new Date(),
    },
    {
      id: 4,
      name: "Queijo Coalho Premium",
      description: "Queijo coalho premium direto do nordeste brasileiro. Sabor marcante e textura perfeita para grelhar. Experiência gastronômica única.",
      price500g: "35.90",
      price1kg: "71.80",
      originalPrice500g: "47.90",
      originalPrice1kg: "95.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/M9L3X6vm.jpg",
      imageUrls: ["https://i.imgur.com/M9L3X6vm.jpg"],
      weight: "500g",
      stock: 15,
      featured: false,
      discount: 25,
      rating: "4.8",
      reviews: 89,
      createdAt: new Date(),
    },
    {
      id: 5,
      name: "Queijo Canastra Artesanal",
      description: "Legítimo queijo Canastra, patrimônio cultural de Minas Gerais. Sabor inconfundível que representa a tradição queijeira mineira há gerações.",
      price500g: "45.90",
      price1kg: "91.80",
      originalPrice500g: "61.90",
      originalPrice1kg: "123.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/F7H9B2vm.jpg",
      imageUrls: ["https://i.imgur.com/F7H9B2vm.jpg"],
      weight: "500g",
      stock: 12,
      featured: true,
      discount: 25,
      rating: "4.9",
      reviews: 203,
      createdAt: new Date(),
    },
    {
      id: 6,
      name: "Queijo Requeijão Cremoso",
      description: "Requeijão cremoso artesanal feito com ingredientes selecionados. Textura aveludada e sabor suave que derrete na boca. Tradição familiar.",
      price500g: "24.90",
      price1kg: "49.80",
      originalPrice500g: "33.90",
      originalPrice1kg: "67.80",
      category: "queijos",
      imageUrl: "https://i.imgur.com/P4K8N7vm.jpg",
      imageUrls: ["https://i.imgur.com/P4K8N7vm.jpg"],
      weight: "500g",
      stock: 40,
      featured: false,
      discount: 26,
      rating: "4.6",
      reviews: 76,
      createdAt: new Date(),
    },
    {
      id: 7,
      name: "Doce de Pingo de Leite com Castanha",
      description: "Tradicional doce mineiro de pingo de leite enriquecido com castanhas selecionadas. Sabor caseiro que remete à infância na fazenda.",
      price500g: "29.90",
      price1kg: "59.80",
      originalPrice500g: "39.90",
      originalPrice1kg: "79.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/A3B9K5vm.jpg",
      imageUrls: ["https://i.imgur.com/A3B9K5vm.jpg"],
      weight: "400g",
      stock: 22,
      featured: true,
      discount: 25,
      rating: "4.8",
      reviews: 134,
      createdAt: new Date(),
    },
    {
      id: 8,
      name: "Doce de Cocada Tradicional",
      description: "Cocada tradicional feita com coco fresco e açúcar cristal. Textura crocante por fora e macia por dentro. Receita da vovó preservada.",
      price500g: "26.90",
      price1kg: "53.80",
      originalPrice500g: "35.90",
      originalPrice1kg: "71.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/L8N2M4vm.jpg",
      imageUrls: ["https://i.imgur.com/L8N2M4vm.jpg"],
      weight: "350g",
      stock: 28,
      featured: false,
      discount: 25,
      rating: "4.7",
      reviews: 87,
      createdAt: new Date(),
    },
    {
      id: 9,
      name: "Doce de Leite Cremoso Premium",
      description: "Doce de leite cremoso premium feito no tacho de cobre. Consistência perfeita e sabor intenso que derrete na boca. Pura tradição mineira.",
      price500g: "31.90",
      price1kg: "63.80",
      originalPrice500g: "42.90",
      originalPrice1kg: "85.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/R6T8W1vm.jpg",
      imageUrls: ["https://i.imgur.com/R6T8W1vm.jpg"],
      weight: "450g",
      stock: 35,
      featured: true,
      discount: 25,
      rating: "4.9",
      reviews: 198,
      createdAt: new Date(),
    },
    {
      id: 10,
      name: "Doce de Mamão com Coco",
      description: "Combinação perfeita entre mamão verde e coco ralado fresco. Doce cristalizado no ponto exato. Sabor tropical que conquista paladares.",
      price500g: "28.90",
      price1kg: "57.80",
      originalPrice500g: "38.90",
      originalPrice1kg: "77.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/V9X3C2vm.jpg",
      imageUrls: ["https://i.imgur.com/V9X3C2vm.jpg"],
      weight: "380g",
      stock: 18,
      featured: false,
      discount: 25,
      rating: "4.6",
      reviews: 92,
      createdAt: new Date(),
    },
    {
      id: 11,
      name: "Doce de Abóbora com Canela",
      description: "Doce de abóbora temperado com canela em pau. Receita colonial que atravessa gerações. Sabor marcante e aroma irresistível.",
      price500g: "25.90",
      price1kg: "51.80",
      originalPrice500g: "34.90",
      originalPrice1kg: "69.80",
      category: "doces",
      imageUrl: "https://i.imgur.com/S5Y7J9vm.jpg",
      imageUrls: ["https://i.imgur.com/S5Y7J9vm.jpg"],
      weight: "420g",
      stock: 25,
      featured: false,
      discount: 25,
      rating: "4.5",
      reviews: 67,
      createdAt: new Date(),
    }
  ];
  productIdCounter = products.length + 1;
};

initializeProducts();

export const storage = {
  // Product operations
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

  // Cart operations
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
    console.log('=== INÍCIO CREATE ORDER ===');
    console.log('Order data recebido:', JSON.stringify(orderData, null, 2));
    
    try {
      const blackCatApiKey = process.env.BLACKCAT_API_KEY;
      
      console.log('Verificando API Key...');
      console.log('API Key presente:', !!blackCatApiKey);
      console.log('Primeiros 10 caracteres da key:', blackCatApiKey ? blackCatApiKey.substring(0, 10) + '...' : 'undefined');
      
      if (!blackCatApiKey) {
        console.error('❌ BLACKCAT_API_KEY não configurada');
        throw new Error('BLACKCAT_API_KEY não configurada no ambiente');
      }

      // Gerar identificador único mais robusto
      const identificador = `PEDIDO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      console.log('📝 Identificador gerado:', identificador);

      // Validar valor
      const valorFloat = parseFloat(orderData.total);
      if (isNaN(valorFloat) || valorFloat <= 0) {
        throw new Error(`Valor inválido: ${orderData.total}`);
      }
      console.log('💰 Valor validado:', valorFloat);

      // Preparar payload para BlackCat
      const pixPayload = {
        valor: valorFloat,
        identificador: identificador,
        solicitacao_pagador: "Pagamento - Tábua de Minas"
      };
      
      console.log('📤 Payload para BlackCat:', JSON.stringify(pixPayload, null, 2));

      console.log('🔄 Fazendo requisição para BlackCat API...');
      
      // Fazer requisição com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      const pixResponse = await fetch('https://api.blackcat.bio/pix/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${blackCatApiKey}`,
          'User-Agent': 'Tabua-de-Minas/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pixPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 Resposta da BlackCat:');
      console.log('- Status:', pixResponse.status);
      console.log('- Status Text:', pixResponse.statusText);
      console.log('- Headers:', Object.fromEntries(pixResponse.headers));

      if (!pixResponse.ok) {
        const errorText = await pixResponse.text();
        console.error('❌ Erro da BlackCat API:', errorText);
        console.error('❌ Status completo:', {
          status: pixResponse.status,
          statusText: pixResponse.statusText,
          body: errorText
        });
        
        throw new Error(`BlackCat API Error ${pixResponse.status}: ${errorText}`);
      }

      const pixPayment = await pixResponse.json();
      console.log('✅ PIX Payment recebido:', JSON.stringify(pixPayment, null, 2));

      // Validar resposta da BlackCat
      if (!pixPayment.pix || !pixPayment.pix.qrcode) {
        console.error('❌ Resposta inválida da BlackCat:', pixPayment);
        throw new Error('Resposta inválida da BlackCat API - QR Code não encontrado');
      }

      const order = {
        id: orderIdCounter++,
        ...orderData,
        pixCode: pixPayment.pix.qrcode,
        pixKey: pixPayment.pix.chave || 'N/A',
        blackCatTransactionId: pixPayment.identificador,
        blackCatResponse: pixPayment, // Para debug
        createdAt: new Date(),
        status: 'pending'
      };
      
      orders.push(order);
      
      console.log('✅ Pedido criado com sucesso:', {
        orderId: order.id,
        transactionId: order.blackCatTransactionId,
        pixCodeLength: order.pixCode.length
      });
      console.log('=== FIM CREATE ORDER ===');
      
      return order;
      
    } catch (error) {
      console.error('❌ ERRO GERAL em createOrder:');
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
      console.error('- Name:', error.name);
      
      if (error.name === 'AbortError') {
        console.error('❌ Timeout na requisição para BlackCat');
        throw new Error('Timeout ao conectar com a API de pagamento');
      }
      
      console.log('=== FIM CREATE ORDER (ERRO) ===');
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