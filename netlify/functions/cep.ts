import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Extract CEP from path
      const pathParts = event.path.split('/');
      const cep = pathParts[pathParts.length - 1];
      
      if (!cep) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'CEP is required' }),
        };
      }

      // Clean CEP (remove non-numeric characters)
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid CEP format' }),
        };
      }
      
      // Fetch from ViaCEP API
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'CEP not found' }),
        };
      }
      
      // Return formatted response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          zipCode: data.cep
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('CEP API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch CEP data' }),
    };
  }
};