import { Handler } from '@netlify/functions';
import { storage } from './storage';

export const handler: Handler = async (event, context) => {
  console.log('=== ORDERS FUNCTION INICIADA ===');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('📋 Respondendo OPTIONS request');
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'POST') {
      console.log('📤 Processando POST request');
      console.log('Raw body:', event.body);
      
      if (!event.body) {
        console.error('❌ Body vazio na requisição');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Body da requisição é obrigatório',
            received: event.body 
          }),
        };
      }

      let body;
      try {
        body = JSON.parse(event.body);
        console.log('📝 Body parseado:', JSON.stringify(body, null, 2));
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse do JSON:', parseError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'JSON inválido',
            details: parseError.message 
          }),
        };
      }

      // Validar dados básicos
      if (!body.total || isNaN(parseFloat(body.total))) {
        console.error('❌ Total inválido:', body.total);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Total é obrigatório e deve ser um número válido',
            received: body.total 
          }),
        };
      }

      console.log('🔄 Chamando storage.createOrder...');
      const startTime = Date.now();
      
      const order = await storage.createOrder(body);
      
      const endTime = Date.now();
      console.log(`✅ Order criada em ${endTime - startTime}ms`);
      console.log('📋 Order criada:', {
        id: order.id,
        status: order.status,
        pixCodePresent: !!order.pixCode,
        transactionId: order.blackCatTransactionId
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(order),
      };
    }

    console.log('❌ Método não permitido:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('❌ ERRO GERAL na Orders Function:');
    console.error('- Message:', error.message);
    console.error('- Stack:', error.stack);
    console.error('- Name:', error.name);
    
    // Determinar status code baseado no tipo de erro
    let statusCode = 500;
    let errorMessage = 'Erro interno do servidor';
    
    if (error.message.includes('BLACKCAT_API_KEY')) {
      statusCode = 503;
      errorMessage = 'Serviço de pagamento temporariamente indisponível';
    } else if (error.message.includes('Timeout')) {
      statusCode = 504;
      errorMessage = 'Timeout ao processar pagamento';
    } else if (error.message.includes('BlackCat API Error')) {
      statusCode = 502;
      errorMessage = 'Erro no processamento do pagamento';
    }
    
    console.log('=== FIM ORDERS FUNCTION (ERRO) ===');
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined,
        timestamp: new Date().toISOString()
      }),
    };
  }
};
