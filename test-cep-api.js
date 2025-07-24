// Teste da API CEP para validar funcionamento
const testCEP = async (cep) => {
  try {
    console.log(`\n=== Testando CEP: ${cep} ===`);
    
    // Simular a chamada que seria feita no browser
    const cleanCep = cep.replace(/\D/g, '');
    console.log(`CEP limpo: ${cleanCep}`);
    
    // Chamar diretamente a ViaCEP (como nossa função faz)
    const viaCepUrl = `https://viacep.com.br/ws/${cleanCep}/json/`;
    console.log(`URL ViaCEP: ${viaCepUrl}`);
    
    const response = await fetch(viaCepUrl);
    console.log(`Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados retornados:', JSON.stringify(data, null, 2));
    
    if (data.erro) {
      console.log('❌ CEP não encontrado na ViaCEP');
      return false;
    }
    
    console.log('✅ CEP encontrado e válido');
    return true;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
};

// Testar alguns CEPs
const testCeps = [
  '01310-100', // São Paulo - Av. Paulista
  '20040-020', // Rio de Janeiro - Centro
  '30112-000', // Belo Horizonte - Centro
  '01310100',  // Mesmo CEP sem formatação
  '12345-678'  // CEP inválido para teste
];

(async () => {
  console.log('🔍 Iniciando testes da API CEP...\n');
  
  for (const cep of testCeps) {
    await testCEP(cep);
  }
  
  console.log('\n🏁 Testes concluídos!');
})();
