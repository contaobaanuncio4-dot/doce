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
    // Extract CEP from multiple possible sources
    let cep = '';
    
    // Try getting from URL path segments
    const pathSegments = event.path.split('/').filter(Boolean);
    const cepIndex = pathSegments.findIndex(segment => segment === 'cep');
    if (cepIndex !== -1 && cepIndex + 1 < pathSegments.length) {
      cep = pathSegments[cepIndex + 1];
    }
    
    // Fallback to last path segment if no explicit /cep/ found
    if (!cep && pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment !== 'cep' && /^\d/.test(lastSegment)) {
        cep = lastSegment;
      }
    }
    
    // Fallback to query parameter
    if (!cep && event.queryStringParameters?.cep) {
      cep = event.queryStringParameters.cep;
    }
    
    console.log('CEP Extraction Debug:', {
      originalPath: event.path,
      pathSegments,
      extractedCep: cep,
      query: event.queryStringParameters
    });
    
    if (!cep) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'CEP é obrigatório',
          debug: {
            path: event.path,
            segments: pathSegments,
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
          error: 'CEP deve ter 8 dígitos',
          provided: cep,
          cleaned: cleanCep
        }),
      };
    }
    
    console.log(`Consultando CEP ${cleanCep} na ViaCEP...`);
    
    // Call ViaCEP API with timeout and retry logic
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout na consulta do CEP')), 10000)
    );
    
    const fetchPromise = fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'TabuaDeMinas/1.0',
        'Accept': 'application/json'
      }
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      throw new Error(`ViaCEP retornou status ${response.status}`);
    }
    
    const viaCepData = await response.json();
    
    console.log('Resposta da ViaCEP:', viaCepData);
    
    // Check if CEP was found
    if (viaCepData.erro === true || viaCepData.erro === 'true') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'CEP não encontrado',
          cep: cleanCep
        }),
      };
    }
    
    // Validate required fields
    if (!viaCepData.logradouro && !viaCepData.localidade) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'CEP não possui informações completas',
          cep: cleanCep,
          data: viaCepData
        }),
      };
    }
    
    // Format response
    const formattedResponse = {
      address: viaCepData.logradouro || '',
      neighborhood: viaCepData.bairro || '',
      city: viaCepData.localidade || '',
      state: viaCepData.uf || '',
      zipCode: viaCepData.cep || cleanCep,
      complement: viaCepData.complemento || '',
      originalData: viaCepData // For debugging
    };
    
    console.log('Resposta formatada:', formattedResponse);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedResponse),
    };
    
  } catch (error) {
    console.error('Erro na consulta do CEP:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno ao consultar CEP',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      }),
    };
  }
};