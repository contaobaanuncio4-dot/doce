interface BlackCatCustomer {
  name: string;
  email: string;
  phone: string;
  document: {
    number: string;
    type: "cpf";
  };
}

interface BlackCatItem {
  title: string;
  unitPrice: number;
  quantity: number;
  tangible: boolean;
}

interface BlackCatPixRequest {
  amount: number;
  paymentMethod: "pix";
  pix: {
    expiresInDays: number;
  };
  items: BlackCatItem[];
  customer: BlackCatCustomer;
  externalRef?: string;
}

interface BlackCatPixResponse {
  id: number;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  pix: {
    qrcode: string;
    expirationDate: string;
    end2EndId?: string;
    receiptUrl?: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    document: {
      type: string;
      number: string;
    };
  };
  secureId: string;
  secureUrl: string;
}

export class BlackCatAPI {
  private baseUrl = 'https://api.blackcatpagamentos.com/v1';
  private authToken: string;

  constructor() {
    const apiKey = process.env.BLACKCAT_API_KEY;
    const apiSecret = process.env.BLACKCAT_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('BlackCat API credentials not configured');
    }
    
    // Criar token de autenticação Basic
    this.authToken = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  }

  async createPixTransaction(data: BlackCatPixRequest): Promise<BlackCatPixResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'authorization': `Basic ${this.authToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BlackCat API Error:', response.status, errorText);
        throw new Error(`BlackCat API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result as BlackCatPixResponse;
    } catch (error) {
      console.error('Error creating PIX transaction:', error);
      throw error;
    }
  }

  async getTransaction(transactionId: number): Promise<BlackCatPixResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'authorization': `Basic ${this.authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BlackCat API Error:', response.status, errorText);
        throw new Error(`BlackCat API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result as BlackCatPixResponse;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  // Converte valor de reais para centavos
  static convertToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  // Converte centavos para reais
  static convertFromCents(cents: number): number {
    return cents / 100;
  }

  // Limpa CPF removendo caracteres especiais
  static cleanCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  // Limpa telefone removendo caracteres especiais
  static cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}