const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';
const SESSION_ID = 'wil3rxwaf0q';

async function testCartIssue() {
  console.log('🧪 Testando Problema do Carrinho Vazio\n');

  try {
    // Passo 1: Verificar se o carrinho está vazio
    console.log('1️⃣ Verificando carrinho atual...');
    const cartResponse = await fetch(`${API_BASE}/cart?sessionId=${SESSION_ID}`);
    const cartData = await cartResponse.json();
    
    console.log('📦 Itens no carrinho:', cartData.length);
    
    if (cartData.length === 0) {
      console.log('⚠️ Carrinho está vazio, adicionando produto...');
      
      // Passo 2: Adicionar produto ao carrinho
      const addResponse = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          productId: 1,
          quantity: 1,
          size: '500g',
          price: '33.90'
        })
      });
      
      const addData = await addResponse.json();
      console.log('✅ Produto adicionado:', addData);
      
      // Passo 3: Verificar novamente o carrinho
      const cartResponse2 = await fetch(`${API_BASE}/cart?sessionId=${SESSION_ID}`);
      const cartData2 = await cartResponse2.json();
      console.log('📦 Itens no carrinho após adição:', cartData2.length);
      
      if (cartData2.length > 0) {
        console.log('✅ Carrinho agora tem itens, testando criação de pedido...');
        
        // Passo 4: Tentar criar pedido
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId: SESSION_ID,
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
        
        if (orderResponse.ok) {
          console.log('🎉 Pedido criado com sucesso!');
          console.log('📋 Detalhes do pedido:', {
            id: orderData.id,
            hasPixCode: !!orderData.pixCode,
            pixCodeLength: orderData.pixCode ? orderData.pixCode.length : 0
          });
        } else {
          console.log('❌ Erro ao criar pedido:', orderData);
        }
      } else {
        console.log('❌ Carrinho ainda está vazio após adicionar produto');
      }
    } else {
      console.log('✅ Carrinho já tem itens, testando criação de pedido...');
      
      // Tentar criar pedido diretamente
      const orderResponse = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: SESSION_ID,
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
      
      if (orderResponse.ok) {
        console.log('🎉 Pedido criado com sucesso!');
        console.log('📋 Detalhes do pedido:', {
          id: orderData.id,
          hasPixCode: !!orderData.pixCode,
          pixCodeLength: orderData.pixCode ? orderData.pixCode.length : 0
        });
      } else {
        console.log('❌ Erro ao criar pedido:', orderData);
      }
    }
    
  } catch (error) {
    console.error('💥 Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar teste
testCartIssue(); 
