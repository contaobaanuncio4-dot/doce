# ✅ PIX no Netlify - Configuração Final

## 🔧 O Que Foi Corrigido

Atualizei os arquivos do Netlify com a mesma integração BlackCat que funciona no Replit:

### ✅ Arquivos Atualizados:
- `netlify/functions/storage.ts` - Integração PIX da BlackCat com logs detalhados
- `netlify/functions/orders.ts` - Validação e tratamento de erros melhorados

### ✅ Melhorias Implementadas:
- Logs detalhados para debug no Netlify
- Timeout de 30 segundos para requests da BlackCat  
- Validação completa de dados antes de processar
- Tratamento específico de erros da API BlackCat
- Headers corretos para a API BlackCat (`User-Agent`, `Accept`)

## 🔑 Configurar no Netlify

### 1. Adicionar Variável de Ambiente

No dashboard do Netlify:

1. **Site settings** → **Environment variables**
2. **Add environment variable**

**Dados para configurar:**
```
Key: BLACKCAT_API_KEY
Secret: ☑️ Contains secret values
Scopes: 
  ☑️ Builds
  ☑️ Functions ✅ (OBRIGATÓRIO)  
  ☑️ Runtime
Values: Same value for all deploy contexts
Value: [sua_chave_blackcat]
```

### 2. Fazer Redeploy

**OBRIGATÓRIO**: Após adicionar a variável:
- **Deploys** → **Trigger deploy** → **Deploy site**
- Aguardar build completar

### 3. Testar API

Após o deploy, testar:

```bash
# Testar criação de pedido PIX
curl -X POST https://seu-site.netlify.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test PIX",
    "customerEmail": "test@test.com", 
    "customerPhone": "11999999999",
    "customerCpf": "12345678901",
    "address": "Rua Test",
    "addressNumber": "123",
    "neighborhood": "Centro", 
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234567",
    "sessionId": "test",
    "total": "50.00"
  }'
```

## 📋 Resultado Esperado

### ✅ Sucesso (Status 200):
```json
{
  "id": 1,
  "customerName": "Test PIX",
  "total": "50.00",
  "pixCode": "00020126580014BR.GOV.BCB.PIX...",
  "blackCatTransactionId": "PEDIDO-1234567890-5678",
  "status": "pending",
  "createdAt": "2025-07-26T03:15:00.000Z"
}
```

### ❌ Erro (Status 503):
```json
{
  "error": "Serviço de pagamento temporariamente indisponível"
}
```
**Causa**: `BLACKCAT_API_KEY` não configurada

## 🐛 Debug

### Ver Logs do Netlify:
1. **Functions** → **orders** → **Function log**
2. Procurar por:
   - `=== INÍCIO CREATE ORDER ===`
   - `API Key presente: true/false`
   - `BlackCat API Error` (se houver)

### Problemas Comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| Status 503 | API key não configurada | Adicionar `BLACKCAT_API_KEY` |
| Status 504 | Timeout BlackCat | Chave inválida ou API fora do ar |
| Status 502 | Erro BlackCat API | Verificar chave ou payload |

## 📞 Chave BlackCat

Se não tem a chave ainda:

1. **Acesse**: https://api.blackcat.bio
2. **Faça login/cadastro**
3. **API Keys** → **Gerar nova chave**
4. **Copie** a chave secreta
5. **Configure** no Netlify conforme instruções acima

## ✅ Status Final

- ✅ **Código atualizado** com integração BlackCat completa
- ✅ **Logs detalhados** para debug no Netlify
- ✅ **Tratamento de erros** específicos
- ✅ **Timeout handling** para requests
- ✅ **Validação** de dados robusta

Agora basta configurar a `BLACKCAT_API_KEY` no Netlify e fazer redeploy!