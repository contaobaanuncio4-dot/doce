# UTMify Integration - Configuração e Status

## Status Atual: ✅ FUNCIONANDO

A integração UTMify está **totalmente operacional** e configurada corretamente no Replit.

## Configuração de Ambiente

### Variáveis de Ambiente Configuradas
- ✅ `UTMIFY_API_KEY`: Configurada no Replit Secrets
- ✅ Valor: `EYf0pNagmHEyqtYwkMVsbw5KaySM5Y5Ftfga` (Nova chave - Janeiro 2025)
- ✅ Persiste após redeploys automaticamente

## Como Funciona

### 1. Notificação de Pedido Criado (PIX Gerado)
Quando um cliente finaliza um pedido e o PIX é gerado:
```javascript
// Em server/routes.ts linha 241
await notifyUTMifyOrderCreated(order, orderItems, referer, userIP);
```

### 2. Notificação de Pagamento Aprovado
Quando o webhook do BlackCat confirma o pagamento:
```javascript
// Em server/webhook-handler.ts
await notifyUTMifyOrderPaid(order, orderItems, referer, userIP);
```

## Dados Enviados para UTMify

### Formato do Payload
```json
{
  "orderId": "123",
  "platform": "TabuaDeMinas",
  "paymentMethod": "pix",
  "status": "waiting_payment", // ou "paid"
  "createdAt": "2025-01-29T05:08:31.914Z", // ISO 8601
  "approvedDate": "",
  "refundedAt": "",
  "customer": {
    "name": "Nome do Cliente",
    "email": "email@cliente.com",
    "phone": "11999999999",
    "document": "12345678901",
    "country": "BR",
    "ip": "127.0.0.1"
  },
  "products": [...],
  "trackingParameters": {
    "utm_source": "...",
    "utm_campaign": "...",
    // outros UTMs extraídos da URL
  },
  "commission": {
    "totalPriceInCents": 3390,
    "gatewayFeeInCents": 175,
    "userCommissionInCents": 3215,
    "currency": "BRL"
  },
  "isTest": true // false em produção
}
```

## Validação de Funcionamento

### Teste Manual Realizado
```bash
# Teste direto da API UTMify (Nova chave - Janeiro 2025)
curl -X POST https://api.utmify.com.br/api-credentials/orders \
  -H "Content-Type: application/json" \
  -H "x-api-token: EYf0pNagmHEyqtYwkMVsbw5KaySM5Y5Ftfga" \
  -d '{"orderId":"TEST-NOVA-API-1753788993",...}'

# Resultado: ✅ 200 OK
# Resposta: {"OK":true,"data":{},"result":"SUCCESS"}
# Data do teste: 29/01/2025 11:47 AM (CORRIGIDO - FUNCIONANDO NO DEPLOY)
```

## Logs de Debug

### Para Monitorar Funcionamento
Os logs aparecem no console do Replit quando um pedido é criado:

```
[UTMify] Iniciando notifyUTMifyOrderCreated
[UTMify] Order ID: 123
[UTMify] Order Items count: 2
[UTMify API] Preparando payload para envio...
[UTMify API] Status HTTP: 200
[UTMify API] ✓ Resposta de sucesso: {"OK":true,"data":{},"result":"SUCCESS"}
[UTMify API] ✓ Notificação UTMify enviada com sucesso!
```

## Resolução de Problemas Anteriores

### ❌ Problema Original
- UTMify não funcionava após redeploys
- Erro: "INVALID_BODY_FORMAT"
- API retornava 400

### ✅ Solução Implementada
1. **Formato de Data Corrigido**: Mudança de formato UTC string para ISO 8601
2. **Payload Validado**: Estrutura testada e aprovada pela API
3. **Logs Detalhados**: Sistema completo de debugging
4. **Variáveis Persistentes**: Configuração correta no Replit Secrets

## Como Testar

### Via Interface (Recomendado)
1. Acesse o site
2. Adicione produtos ao carrinho
3. Finalize um pedido
4. Verifique os logs no console do Replit

### Via API Direta
```bash
# Usar o script de teste incluído
node test-utmify.js
```

## Status da Integração: ✅ OPERACIONAL

A integração está **100% funcional** e pronta para rastrear todas as conversões e campanhas de marketing no UTMify.