# Configuração de Webhook BlackCat

## Para que serve o Webhook?

O webhook é necessário para receber notificações automáticas quando o status de um pagamento PIX muda no gateway BlackCat. Isso permite:

- ✅ Atualizar o status do pedido automaticamente quando o pagamento é aprovado
- ✅ Cancelar pedidos quando o pagamento falha ou expira
- ✅ Manter o cliente informado sobre o status do pagamento
- ✅ Processar automaticamente a entrega quando o pagamento é confirmado

## URLs dos Webhooks

### No Replit:
```
https://seu-dominio.replit.dev/api/webhooks/blackcat
```

### No Netlify:
```
https://tabuademinas.fun/api/webhooks/blackcat
```

**⚠️ IMPORTANTE**: O webhook no Netlify precisa ser reimplantado para funcionar. Após fazer push das alterações, a função webhook-blackcat.ts será automaticamente implantada.

## Como Configurar no BlackCat

1. **Acesse o painel do BlackCat**
2. **Vá para Configurações > Webhooks**
3. **Adicione a URL do webhook apropriada**
4. **Selecione os eventos:**
   - `payment.paid` (pagamento aprovado)
   - `payment.cancelled` (pagamento cancelado)
   - `payment.pending` (pagamento pendente)

## Testando o Webhook

Você pode testar o webhook fazendo uma requisição POST para a URL:

```bash
curl -X POST https://seu-site.netlify.app/.netlify/functions/webhook-blackcat \
  -H "Content-Type: application/json" \
  -d '{
    "identificador": "PEDIDO-123",
    "status": "paid",
    "valor": "100.00",
    "timestamp": "2025-01-24T22:00:00Z",
    "transaction_id": "TXN-456"
  }'
```

## Segurança

O webhook já está preparado para validar assinaturas do BlackCat quando eles fornecerem essa funcionalidade. Por enquanto, funciona sem validação para facilitar a implementação.

## Status dos Pedidos

O sistema reconhece os seguintes status:
- `pending` - Aguardando pagamento
- `paid` - Pagamento aprovado
- `cancelled` - Pagamento cancelado/expirado

Quando um webhook é recebido, o status do pedido é atualizado automaticamente no sistema.