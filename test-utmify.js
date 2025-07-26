// Teste simples para verificar a integração UTMify
import fetch from 'node-fetch';

async function testUTMify() {
  const apiKey = process.env.UTMIFY_API_KEY;
  
  if (!apiKey) {
    console.error('❌ UTMIFY_API_KEY não configurado');
    return;
  }

  console.log('✅ UTMIFY_API_KEY encontrado');
  console.log('🔑 Chave:', apiKey.substring(0, 10) + '...');

  // Dados de teste
  const testOrder = {
    orderId: "TEST-" + Date.now(),
    platform: "TabuaDeMinas",
    paymentMethod: "pix",
    status: "waiting_payment",
    createdAt: "2025-01-19 23:30:00",
    approvedDate: "",
    refundedAt: "",
    customer: {
      name: "João Teste",
      email: "joao@teste.com",
      phone: "11999999999",
      document: "12345678901",
      country: "BR",
      ip: "127.0.0.1"
    },
    products: [
      {
        id: "1",
        name: "Queijo MinasBri - 500g",
        planId: "default",
        planName: "Produto Avulso",
        quantity: 1,
        priceInCents: 3390
      }
    ],
    trackingParameters: {
      src: null,
      sck: null,
      utm_source: "google",
      utm_campaign: "queijos_artesanais",
      utm_medium: "cpc",
      utm_content: "banner_principal",
      utm_term: "queijo_minas"
    },
    commission: {
      totalPriceInCents: 3390,
      gatewayFeeInCents: 175,
      userCommissionInCents: 3215,
      currency: "BRL"
    },
    isTest: true
  };

  try {
    console.log('🚀 Enviando pedido de teste para UTMify...');
    
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(testOrder)
    });

    console.log('📊 Status da resposta:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Sucesso! UTMify respondeu:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na resposta:');
      console.log('Status:', response.status);
      console.log('Resposta:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com UTMify:', error.message);
  }
}

testUTMify();