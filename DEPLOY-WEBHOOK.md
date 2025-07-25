# Como Resolver o Webhook no Netlify

## Problema Atual
O webhook está retornando 404 no Netlify porque a função `webhook-blackcat.ts` não foi implantada ainda.

## Solução

### 1. Verificar se os arquivos estão corretos:
- ✅ `netlify/functions/webhook-blackcat.ts` - Criado
- ✅ `netlify.toml` - Redirect adicionado
- ✅ `server/webhook-handler.ts` - Funcionando no Replit

### 2. Para implantar no Netlify:

**Opção A - Push via Git:**
```bash
git add .
git commit -m "Add BlackCat webhook function"
git push origin main
```

**Opção B - Redesenvolver no Netlify:**
1. Vá para o painel do Netlify
2. Site settings > Functions
3. Clique em "Redeploy site" 
4. Aguarde o build completar

### 3. Testar após implantação:
```bash
curl -X POST https://tabuademinas.fun/api/webhooks/blackcat \
  -H "Content-Type: application/json" \
  -d '{
    "identificador": "PEDIDO-123",
    "status": "paid",
    "valor": "100.00",
    "timestamp": "2025-01-24T22:00:00Z",
    "transaction_id": "TXN-456"
  }'
```

## Status Atual
- ❌ Webhook retornando 404 (função não implantada)
- ✅ Código webhook criado e funcionando localmente
- ✅ Redirect configurado no netlify.toml
- ⏳ Aguardando reimplantação no Netlify

## Configuração no BlackCat (após implantar)
1. Painel BlackCat > Configurações > Webhooks
2. URL: `https://tabuademinas.fun/api/webhooks/blackcat`
3. Eventos: `payment.paid`, `payment.cancelled`, `payment.pending`
4. Salvar configuração

## Logs para Debug
Após implantar, você pode monitorar os logs da função no painel do Netlify:
Site settings > Functions > webhook-blackcat > Function log