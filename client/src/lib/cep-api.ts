export interface CEPData {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export async function fetchCEP(cep: string): Promise<CEPData> {
  const response = await fetch(`/api/cep/${cep}`);
  
  if (!response.ok) {
    throw new Error("CEP não encontrado");
  }
  
  const data = await response.json();
  return data;
}
