# ✅ Configuração Final do Netlify

## 🔑 Configurar API Key no Netlify

### No Dashboard do Netlify:

1. **Acesse Environment Variables**
   - Site settings → Environment variables
   - Add environment variable

2. **Configure Exatamente Assim**:
   ```
   Key: BLACKCAT_API_KEY
   Secret: ☑️ Contains secret values
   Scopes:
     ☑️ Builds
     ☑️ Functions  
     ☑️ Runtime
   Values: Same value for all deploy contexts
   Value: [sua_chave_blackcat_aqui]
   ```

3. **Clique em "Create variable"**

## 🚀 Redeploy Obrigatório

Após adicionar a variável:

1. **Trigger Deploy**
   - Deploys → Trigger deploy
   - Deploy site

2. **Aguardar Build**
   - Functions precisam ser recompiladas
   - Build deve completar sem erros

## 🧪 Testar APIs

Após o deploy, testar:

```bash
# 1. Produtos (deve funcionar)
curl https://seu-site.netlify.app/api/products

# 2. Carrinho (deve funcionar)
curl -X POST https://seu-site.netlify.app/api/cart \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","productId":1,"quantity":1,"size":"500g","price":"33.90"}'

# 3. Orders (deve funcionar agora)
curl -X POST https://seu-site.netlify.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","customerEmail":"test@test.com","customerPhone":"11999999999","customerCpf":"12345678901","address":"Rua Test","addressNumber":"123","neighborhood":"Centro","city":"São Paulo","state":"SP","zipCode":"01234567","sessionId":"test","total":"50.00"}'
```

## ⚠️ Importante

- **Apenas uma chave**: `BLACKCAT_API_KEY`
- **É a chave secreta**: Sim, a mesma que você usa na BlackCat
- **Scopes obrigatórios**: Functions deve estar marcado
- **Redeploy necessário**: Sem isso a API não funciona

## ✅ Resultado Esperado

Após configurar corretamente:
- ❌ Erro 500 em /api/orders → ✅ Funcionando
- ✅ PIX sendo gerado corretamente
- ✅ Site funcionando 100%

A chave que você forneceu agora está disponível no ambiente. Basta configurar no Netlify exatamente como mostrado acima.