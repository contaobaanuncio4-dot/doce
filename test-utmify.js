// Teste manual da API UTMify
const UTMIFY_API_KEY = process.env.UTMIFY_API_KEY;

async function testUTMify() {
  const testOrder = {
    orderId: `TEST-${Date.now()}`,
    platform: "TabuaDeMinas",
    paymentMethod: "pix",
    status: "waiting_payment",
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    approvedDate: null,
    refundedAt: null,
    customer: {
      name: "Cliente Teste UTMify",
      email: "teste@tabuademinas.com",
      phone: "11999999999",
      document: "12345678901",
      country: "BR",
      ip: "127.0.0.1"
    },
    products: [
      {
        id: "1",
        name: "Queijo MinasBri",
        planId: null,
        planName: null,
        quantity: 1,
        priceInCents: 3390
      }
    ],
    trackingParameters: {
      src: null,
      sck: null,
      utm_source: "FB",
      utm_campaign: "TESTE_MANUAL",
      utm_medium: "social",
      utm_content: null,
      utm_term: null
    },
    commission: {
      totalPriceInCents: 3390,
      gatewayFeeInCents: 175,
      userCommissionInCents: 3215,
      currency: "BRL"
    },
    isTest: false
  };

  console.log('Testando UTMify API...');
  console.log('API Key disponível:', UTMIFY_API_KEY ? 'SIM' : 'NÃO');
  console.log('Payload:', JSON.stringify(testOrder, null, 2));

  try {
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': UTMIFY_API_KEY
      },
      body: JSON.stringify(testOrder)
    });

    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    
    const result = await response.text();
    console.log('Resposta:', result);

    if (response.ok) {
      console.log('✅ SUCESSO: UTMify recebeu a notificação!');
    } else {
      console.log('❌ ERRO: UTMify rejeitou a notificação');
    }

  } catch (error) {
    console.error('❌ ERRO DE CONEXÃO:', error);
  }
}

testUTMify();