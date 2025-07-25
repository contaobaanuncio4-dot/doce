import { Context } from "@netlify/functions";
import { storage } from "./storage";

interface BlackCatWebhookPayload {
  identificador: string;
  status: 'paid' | 'cancelled' | 'pending';
  valor: string;
  timestamp: string;
  transaction_id: string;
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const payload: BlackCatWebhookPayload = await req.json();
    
    console.log('BlackCat Webhook recebido:', payload);
    
    // Verificar se o pedido existe
    const orders = await storage.getOrdersByTransactionId(payload.identificador);
    
    if (orders.length === 0) {
      console.warn('Pedido não encontrado para o identificador:', payload.identificador);
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const order = orders[0];
    
    // Atualizar status do pedido baseado no webhook
    let newStatus = 'pending';
    switch (payload.status) {
      case 'paid':
        newStatus = 'paid';
        break;
      case 'cancelled':
        newStatus = 'cancelled';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
    }
    
    // Atualizar o pedido no storage
    await storage.updateOrderStatus(order.id, newStatus);
    
    console.log(`Pedido ${order.id} atualizado para status: ${newStatus}`);
    
    // Aqui você pode adicionar lógica adicional como:
    // - Enviar email de confirmação
    // - Atualizar estoque
    // - Notificar sistema de entrega
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processado com sucesso' 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Erro ao processar webhook BlackCat:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};