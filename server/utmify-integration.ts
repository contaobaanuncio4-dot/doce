import type { Order, OrderItem } from "@shared/schema";

interface UTMifyCustomer {
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  country?: string;
  ip?: string;
}

interface UTMifyProduct {
  id: string;
  name: string;
  planId: string;
  planName: string;
  quantity: number;
  priceInCents: number;
}

interface UTMifyTrackingParameters {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

interface UTMifyCommission {
  totalPriceInCents: number;
  gatewayFeeInCents: number;
  userCommissionInCents: number;
  currency?: 'BRL' | 'USD' | 'EUR' | 'GBP' | 'ARS' | 'CAD';
}

interface UTMifyOrderData {
  orderId: string;
  platform: string;
  paymentMethod: 'credit_card' | 'boleto' | 'pix' | 'paypal' | 'free_price';
  status: 'waiting_payment' | 'paid' | 'refused' | 'refunded' | 'chargedback';
  createdAt: string; // UTC format: 'YYYY-MM-DD HH:MM:SS'
  approvedDate: string; // UTC format: 'YYYY-MM-DD HH:MM:SS' ou string vazia
  refundedAt: string; // UTC format: 'YYYY-MM-DD HH:MM:SS' ou string vazia
  customer: UTMifyCustomer;
  products: UTMifyProduct[];
  trackingParameters: UTMifyTrackingParameters;
  commission: UTMifyCommission;
  isTest?: boolean;
}

// Função para converter data brasileira para UTC (mínimo 1 semana atrás conforme doc UTMify)
function toUTCString(date: Date): string {
  const utcDate = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)); // 1 semana no passado
  return utcDate.toISOString().replace('T', ' ').substring(0, 19);
}

// Função para extrair parâmetros UTM do referer ou URL
function extractUTMParameters(referer?: string): UTMifyTrackingParameters {
  if (!referer) {
    return {
      src: null,
      sck: null,
      utm_source: null,
      utm_campaign: null,
      utm_medium: null,
      utm_content: null,
      utm_term: null
    };
  }

  try {
    const url = new URL(referer);
    const params = url.searchParams;
    
    return {
      src: params.get('src'),
      sck: params.get('sck'),
      utm_source: params.get('utm_source'),
      utm_campaign: params.get('utm_campaign'),
      utm_medium: params.get('utm_medium'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term')
    };
  } catch {
    return {
      src: null,
      sck: null,
      utm_source: null,
      utm_campaign: null,
      utm_medium: null,
      utm_content: null,
      utm_term: null
    };
  }
}

// Função para converter pedido para formato UTMify
export function convertOrderToUTMify(
  order: Order,
  orderItems: OrderItem[],
  status: 'waiting_payment' | 'paid' | 'refused' | 'refunded',
  referer?: string,
  userIP?: string
): UTMifyOrderData {
  // Calcular total em centavos
  const totalInCents = Math.round(parseFloat(order.total.replace(',', '.')) * 100);
  
  // Taxa do gateway (assumindo 3.99% + R$0.40 para PIX)
  const gatewayFeeInCents = Math.round(totalInCents * 0.0399 + 40);
  const userCommissionInCents = totalInCents - gatewayFeeInCents;

  // Converter produtos com campos obrigatórios
  const products: UTMifyProduct[] = orderItems.map(item => ({
    id: item.productId.toString(),
    name: `Produto ${item.productId} - ${item.size}`,
    planId: "default",
    planName: "Produto Avulso",
    quantity: item.quantity,
    priceInCents: Math.round(parseFloat(item.price.replace(',', '.')) * 100)
  }));

  // Extrair parâmetros UTM
  const trackingParameters = extractUTMParameters(referer);

  const orderData: UTMifyOrderData = {
    orderId: order.id.toString(),
    platform: "TabuaDeMinas",
    paymentMethod: "pix",
    status: status,
    createdAt: toUTCString(order.createdAt ? new Date(order.createdAt) : new Date()),
    approvedDate: status === 'paid' ? toUTCString(new Date()) : "",
    refundedAt: status === 'refunded' ? toUTCString(new Date()) : "",
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone?.replace(/\D/g, '') || null,
      document: order.customerCpf?.replace(/\D/g, '') || null,
      country: "BR",
      ip: userIP
    },
    products: products,
    trackingParameters: trackingParameters,
    commission: {
      totalPriceInCents: totalInCents,
      gatewayFeeInCents: gatewayFeeInCents,
      userCommissionInCents: userCommissionInCents,
      currency: "BRL"
    },
    isTest: false
  };

  return orderData;
}

// Função para enviar dados para UTMify
export async function sendToUTMify(orderData: UTMifyOrderData): Promise<void> {
  const apiKey = process.env.UTMIFY_API_KEY;
  
  if (!apiKey) {
    console.error('UTMIFY_API_KEY não configurado');
    throw new Error('UTMIFY_API_KEY não configurado');
  }

  try {
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro UTMify:', response.status, errorText);
      throw new Error(`UTMify API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Sucesso UTMify:', result);
  } catch (error) {
    console.error('Erro ao enviar para UTMify:', error);
    throw error;
  }
}

// Função para notificar venda criada (PIX gerado)
export async function notifyUTMifyOrderCreated(
  order: Order,
  orderItems: OrderItem[],
  referer?: string,
  userIP?: string
): Promise<void> {
  const orderData = convertOrderToUTMify(order, orderItems, 'waiting_payment', referer, userIP);
  await sendToUTMify(orderData);
}

// Função para notificar venda paga
export async function notifyUTMifyOrderPaid(
  order: Order,
  orderItems: OrderItem[],
  referer?: string,
  userIP?: string
): Promise<void> {
  const orderData = convertOrderToUTMify(order, orderItems, 'paid', referer, userIP);
  await sendToUTMify(orderData);
}

// Função para notificar reembolso
export async function notifyUTMifyOrderRefunded(
  order: Order,
  orderItems: OrderItem[],
  referer?: string,
  userIP?: string
): Promise<void> {
  const orderData = convertOrderToUTMify(order, orderItems, 'refunded', referer, userIP);
  await sendToUTMify(orderData);
}