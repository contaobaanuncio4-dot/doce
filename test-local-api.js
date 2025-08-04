const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testando API Local - Tábua de Minas\n');

  try {
    // Teste 1: API Base
    console.log('1️⃣ Testando API Base...');
    const baseResponse = await fetch(`${API_BASE}`);
    const baseData = await baseResponse.json();
    console.log('✅ API Base:', baseData);
    console.log('');

    // Teste 2: Produtos
    console.log('2️⃣ Testando Produtos...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    console.log(`✅ Produtos encontrados: ${productsData.length}`);
    console.log('');

    // Teste 3: Carrinho
    console.log('3️⃣ Testando Carrinho...');
    const sessionId = 'test-session-' + Date.now();
    
    // Adicionar item ao carrinho
    const addCartResponse = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: sessionId,
        productId: 1,
        quantity: 1,
        size: '500g',
        price: '33.90'
      })
    });
    
    const addCartData = await addCartResponse.json();
    console.log('✅ Item adicionado ao carrinho:', addCartData.id);
    
    // Buscar itens do carrinho
    const getCartResponse = await fetch(`${API_BASE}/cart?sessionId=${sessionId}`);
    const getCartData = await getCartResponse.json();
    console.log(`✅ Itens no carrinho: ${getCartData.length}`);
    console.log('');

    // Teste 4: Pedido com PIX
    console.log('4️⃣ Testando Criação de Pedido com PIX...');
    const orderResponse = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: sessionId,
        customerName: 'Teste Cliente',
        customerEmail: 'teste@exemplo.com',
        customerPhone: '11999999999',
        customerCpf: '12345678901',
        zipCode: '01234-567',
        address: 'Rua Teste, 123',
        addressNumber: '123',
        addressComplement: 'Apto 1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        total: '33.90',
        shippingOption: 'express',
        shippingCost: '9.90',
        paymentMethod: 'pix'
      })
    });
    
    const orderData = await orderResponse.json();
    console.log('✅ Pedido criado:', {
      id: orderData.id,
      hasPixCode: !!orderData.pixCode,
      pixCodeLength: orderData.pixCode ? orderData.pixCode.length : 0,
      pixCodeIsPlaceholder: orderData.pixCode === 'PIX_CODE_PLACEHOLDER',
      status: orderData.status
    });
    
    if (orderData.pixCode && orderData.pixCode !== 'PIX_CODE_PLACEHOLDER') {
      console.log('🎉 PIX real gerado com sucesso!');
    } else {
      console.log('⚠️ PIX simulado retornado (verificar BLACKCAT_API_KEY)');
    }
    console.log('');

    // Teste 5: Verificar variáveis de ambiente
    console.log('5️⃣ Verificando Configuração...');
    console.log('📋 BLACKCAT_API_KEY configurada:', process.env.BLACKCAT_API_KEY ? 'SIM' : 'NÃO');
    if (process.env.BLACKCAT_API_KEY) {
      console.log('🔑 Chave da API (primeiros 10 chars):', process.env.BLACKCAT_API_KEY.substring(0, 10) + '...');
    }
    console.log('');

    console.log('🎯 Todos os testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar testes
testAPI(); 