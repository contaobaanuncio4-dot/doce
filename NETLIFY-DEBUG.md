# Debug do Erro 500 no Netlify Orders

## Problema
A API /api/orders está retornando erro 500 no Netlify.

## Diagnóstico
1. ✅ Webhook funcionando corretamente 
2. ❌ API orders falhando na função createOrder
3. 🔍 Possível problema com BlackCat API ou função de criação PIX

## Possíveis Causas
1. **BLACKCAT_API_KEY não configurada** no Netlify
2. **Erro na chamada da API BlackCat** 
3. **Problema na estrutura da função createOrder**

## Teste Local vs Netlify
- **Local**: Funciona (retorna "Carrinho vazio")
- **Netlify**: Erro 500 interno

## Correção Aplicada
Atualizei a função createOrder para:
- Verificar se BLACKCAT_API_KEY existe
- Criar pedido sem PIX se a chave não estiver configurada
- Tratamento de erro mais robusto

## Próximos Passos
1. Verificar se BLACKCAT_API_KEY está configurada no Netlify
2. Testar a função após correção
3. Se ainda falhar, implementar fallback sem PIX

## URLs para Teste
```bash
# Teste com sessionId válida (tem produtos no carrinho)
curl -X POST https://tabuademinas.fun/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName": "Test", "customerEmail": "test@test.com", "customerPhone": "11999999999", "customerCpf": "12345678901", "address": "Rua Test", "addressNumber": "123", "neighborhood": "Centro", "city": "São Paulo", "state": "SP", "zipCode": "01234567", "sessionId": "default-session", "total": "100.00"}'
```