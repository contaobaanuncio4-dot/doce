const fs = require('fs');

// Simular evento do Netlify
const testEvent = {
  httpMethod: 'GET',
  path: '/api/cep/01310-100',
  queryStringParameters: null,
  headers: {},
  body: null
};

console.log('Testando função CEP com CEP válido: 01310-100');
console.log('Evento simulado:', JSON.stringify(testEvent, null, 2));

// Testar diretamente a API ViaCEP
fetch('https://viacep.com.br/ws/01310100/json/')
  .then(response => response.json())
  .then(data => {
    console.log('\\n✓ ViaCEP API funcionando:');
    console.log(`  Endereço: ${data.logradouro}`);
    console.log(`  Bairro: ${data.bairro}`);
    console.log(`  Cidade: ${data.localidade}`);
    console.log(`  Estado: ${data.uf}`);
  })
  .catch(error => {
    console.log('\\n✗ Erro na API ViaCEP:', error.message);
  });
