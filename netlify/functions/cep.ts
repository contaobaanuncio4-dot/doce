import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  // Only handle GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract CEP from URL path
    const pathParts = event.path.split('/').filter(part => part.length > 0);
    let cep = pathParts[pathParts.length - 1] || '';
    
    // Fallback to query parameter
    if (!cep && event.queryStringParameters?.cep) {
      cep = event.queryStringParameters.cep;
    }
    
    console.log('CEP Debug Info:', JSON.stringify({
      fullPath: event.path,
      pathParts: pathParts,
      extractedCep: cep,
      query: event.queryStringParameters
    }));
    
    if (!cep || cep === 'cep') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'CEP é obrigatório',
          debug: { 
            path: event.path,
            pathParts: pathParts,
            query: event.queryStringParameters
          }
        }),
      };
    }

    // Clean and validate CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Formato de CEP inválido - deve ter 8 dígitos',
          provided: cep,
          cleaned: cleanCep,
          length: cleanCep.length
        }),
      };
    }
    
    console.log(`Buscando CEP ${cleanCep} na API ViaCEP...`);
    
    // Fetch from ViaCEP with error handling
    const viacepUrl = `https://viacep.com.br/ws/${cleanCep}/json/`;
    const response = await fetch(viacepUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Tabua-de-Minas/1.0)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`ViaCEP API error: ${response.status} ${response.statusText}`);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          message: 'Erro ao consultar CEP no servidor externo',
          statusCode: response.status
        }),
      };
    }
    
    const data = await response.json();
    console.log('ViaCEP Response:', JSON.stringify(data));
    
    // Check if CEP was found
    if (data.erro === true || data.erro === 'true') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          message: 'CEP não encontrado',
          cep: cleanCep
        }),
      };
    }
    
    // Validate response data
    if (!data.localidade || !data.uf) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          message: 'Resposta inválida da API de CEP',
          data: data
        }),
      };
    }
    
    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        address: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade,
        state: data.uf,
        zipCode: data.cep || cleanCep
      }),
    };

  } catch (error) {
    console.error('CEP API error:', error);
    
    let errorMessage = 'Failed to fetch CEP data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        debug: {
          path: event.path,
          method: event.httpMethod
        }
      }),
    };
  }
};