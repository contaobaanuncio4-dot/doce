# 🔧 Configuração de Variáveis no Netlify

## 📋 Como Configurar as APIs no Netlify

Baseado na imagem que você mostrou, aqui está o que precisa fazer:

### 1. Acessar Environment Variables
- Vá para o dashboard do seu site no Netlify
- Clique em **Site settings**
- Vá em **Environment variables**
- Clique em **Add environment variable**

### 2. Configurar BLACKCAT_API_KEY

#### Dados para preencher:
- **Key**: `BLACKCAT_API_KEY`
- **Secret**: ☑️ Marcar "Contains secret values" 
- **Scopes**: Selecionar:
  - ☑️ **Builds** (para compilação)
  - ☑️ **Functions** (para as APIs funcionarem)
  - ☑️ **Runtime** (para execução)
- **Values**: Colocar sua chave da BlackCat API

### 3. Configurações Importantes

#### Scopes Necessários:
```
☑️ Builds - Includes project builds
☑️ Functions - Includes Functions, Edge Functions, and On-demand Builders  
☑️ Runtime - Includes forms and signed proxy redirects
```

#### Value Configuration:
- Selecionar: **Same value for all deploy contexts**
- Cole sua chave BlackCat no campo de valor

## 🔑 Chave BlackCat API

Se você não tem a chave ainda, precisa:

1. **Criar conta na BlackCat**:
   - Acesse [api.blackcat.bio](https://api.blackcat.bio)
   - Faça o cadastro
   - Gere sua API key

2. **Configurar no Netlify**:
   - Key: `BLACKCAT_API_KEY`
   - Value: `sua_chave_aqui`
   - Scopes: Functions ✅

## 📁 Functions do Netlify

### Arquivos que precisam estar funcionando:
```
netlify/functions/
├── products.ts     # Lista produtos
├── cart.ts         # Carrinho  
├── orders.ts       # Criar pedidos com PIX
├── webhook-blackcat.ts # Webhook PIX
└── storage.ts      # Dados dos produtos
```

### Status das Functions:
- ✅ **products** - Funcionando
- ✅ **cart** - Funcionando  
- ❌ **orders** - Erro 500 (precisa da API key)
- ✅ **webhook-blackcat** - Funcionando

## 🚨 Problema Atual no Netlify

### Error 500 na API Orders
O erro acontece porque:
1. `BLACKCAT_API_KEY` não está configurada
2. A função `createOrder` falha ao tentar gerar PIX
3. Retorna erro 500 interno

### Solução:
1. Configurar `BLACKCAT_API_KEY` conforme instruções acima
2. Fazer novo deploy no Netlify
3. Testar a API de orders novamente

## 🔄 Após Configurar

### 1. Redeploy Necessário
- Após adicionar a variável de ambiente
- Netlify precisa rebuildar as functions
- Clique em **Deploy** > **Trigger deploy**

### 2. Testar APIs
```bash
# Testar products
curl https://seu-site.netlify.app/api/products

# Testar orders (deve funcionar após configurar chave)
curl -X POST https://seu-site.netlify.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","total":"50.00","sessionId":"test"}'
```

## 📝 Resumo dos Passos

1. **No Netlify Dashboard**:
   - Environment variables
   - Add new variable
   - Key: `BLACKCAT_API_KEY`
   - Marcar "Contains secret values"
   - Scopes: Functions ✅
   - Value: sua chave BlackCat

2. **Redeploy**:
   - Trigger new deploy
   - Aguardar build completar

3. **Testar**:
   - API de orders deve parar de dar erro 500
   - PIX deve ser gerado corretamente

Se você não tem a chave BlackCat ainda, posso te ajudar a configurar uma alternativa ou você pode obter a chave no site da BlackCat.