export interface CEPData {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export async function fetchCEP(cep: string): Promise<CEPData> {
  try {
    // Clean CEP before sending
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos");
    }
    
    console.log(`Consultando CEP: ${cleanCep}`);
    
    const response = await fetch(`/api/cep/${cleanCep}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Resposta da API CEP: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta da API CEP:', errorData);
      throw new Error(errorData.error || "CEP não encontrado");
    }
    
    const data = await response.json();
    console.log('Dados do CEP recebidos:', data);
    
    // Validate response structure
    if (!data.city && !data.address) {
      throw new Error("Dados do CEP incompletos");
    }
    
    return data;
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error instanceof Error ? error : new Error("Erro ao consultar CEP");
  }
}
