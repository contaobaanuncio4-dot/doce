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
  planId: string | null;
  planName: string | null;
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
  createdAt: string; // "YYYY-MM-DD HH:MM:SS" format
  approvedDate: string | null; // "YYYY-MM-DD HH:MM:SS" ou null
  refundedAt: string | null; // "YYYY-MM-DD HH:MM:SS" ou null
  customer: UTMifyCustomer;
  products: UTMifyProduct[];
  trackingParameters: UTMifyTrackingParameters;
  commission: UTMifyCommission;
  isTest?: boolean; // Opcional conforme documentação
}

// Função para converter data para formato UTC aceito pela UTMify
function toUTCString(date: Date): string {
  // UTMify exige formato "YYYY-MM-DD HH:MM:SS" exato conforme documentação
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

  // Converter produtos conforme especificação UTMify
  const products: UTMifyProduct[] = orderItems.map(item => ({
    id: item.productId.toString(),
    name: `Produto ${item.productId} - ${item.size}`,
    planId: null, // Conforme documentação UTMify: null para produtos sem planos
    planName: null, // Conforme documentação UTMify: null para produtos sem planos
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
    approvedDate: status === 'paid' ? toUTCString(new Date()) : null, // null conforme UTMify doc
    refundedAt: status === 'refunded' ? toUTCString(new Date()) : null, // null conforme UTMify doc
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone?.replace(/\D/g, '') || null,
      document: order.customerCpf?.replace(/\D/g, '') || null,
      country: "BR",
      ip: userIP || "127.0.0.1"
    },
    products: products,
    trackingParameters: trackingParameters,
    commission: {
      totalPriceInCents: totalInCents,
      gatewayFeeInCents: gatewayFeeInCents,
      userCommissionInCents: userCommissionInCents,
      currency: "BRL"
    },
    isTest: false // PRODUÇÃO - Para rastreamento real conforme solicitado
  };

  return orderData;
}

// Função para enviar dados para UTMify
export async function sendToUTMify(orderData: UTMifyOrderData): Promise<void> {
  const apiKey = process.env.UTMIFY_API_KEY;
  
  console.log(`[UTMify API] Verificando API Key: ${apiKey ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  
  if (!apiKey) {
    console.error('[UTMify API] UTMIFY_API_KEY não configurado');
    throw new Error('UTMIFY_API_KEY não configurado');
  }

  try {
    console.log('[UTMify API] Preparando payload para envio...');
    console.log('[UTMify API] URL:', 'https://api.utmify.com.br/api-credentials/orders');
    console.log('[UTMify API] Payload:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiKey
      },
      body: JSON.stringify(orderData)
    });

    console.log(`[UTMify API] Status HTTP: ${response.status}`);
    console.log(`[UTMify API] Headers de resposta:`, response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UTMify API] ✗ Erro HTTP:', response.status, response.statusText);
      console.error('[UTMify API] ✗ Corpo da resposta:', errorText);
      throw new Error(`UTMify API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[UTMify API] ✓ Resposta de sucesso:', result);
    console.log('[UTMify API] ✓ Notificação UTMify enviada com sucesso!');
  } catch (error) {
    console.error('[UTMify API] ✗ Erro na requisição:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[UTMify API] ✗ Erro de conectividade - verifique a conexão com a internet');
    }
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
  console.log('[UTMify] Iniciando notifyUTMifyOrderCreated');
  console.log('[UTMify] Order ID:', order.id);
  console.log('[UTMify] Order Items count:', orderItems.length);
  
  const orderData = convertOrderToUTMify(order, orderItems, 'waiting_payment', referer, userIP);
  console.log('[UTMify] Dados convertidos, enviando para API...');
  
  await sendToUTMify(orderData);
  console.log('[UTMify] Notificação enviada com sucesso');
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