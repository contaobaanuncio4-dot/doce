import { Request, Response } from "express";
import { storage } from "./storage";

interface BlackCatWebhookPayload {
  identificador: string;
  status: 'paid' | 'cancelled' | 'pending';
  valor: string;
  timestamp: string;
  transaction_id: string;
}

export async function handleBlackCatWebhook(req: Request, res: Response) {
  try {
    const payload: BlackCatWebhookPayload = req.body;
    
    console.log('BlackCat Webhook recebido:', payload);
    
    // Verificar se o pedido existe
    const orders = await storage.getOrdersByTransactionId(payload.identificador);
    
    if (orders.length === 0) {
      console.warn('Pedido não encontrado para o identificador:', payload.identificador);
      return res.status(404).json({ error: 'Pedido não encontrado' });
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
    
    res.status(200).json({ success: true, message: 'Webhook processado com sucesso' });
    
  } catch (error) {
    console.error('Erro ao processar webhook BlackCat:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Middleware para validar assinatura do webhook (opcional mas recomendado)
export function validateWebhookSignature(req: Request, res: Response, next: Function) {
  const signature = req.headers['x-blackcat-signature'] as string;
  const apiKey = process.env.BLACKCAT_API_KEY;
  
  if (!signature || !apiKey) {
    return res.status(401).json({ error: 'Assinatura do webhook inválida' });
  }
  
  // Aqui você implementaria a validação da assinatura
  // A BlackCat deve fornecer detalhes sobre como validar
  
  next();
}