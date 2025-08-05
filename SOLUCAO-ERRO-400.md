# 🔧 Solução para Erro 400 - Criação de Pedidos

## 🎯 Problema Identificado

O erro 400 (Bad Request) na criação de pedidos está ocorrendo porque:

1. **Carrinho vazio** - O sessionId não tem itens no carrinho
2. **Dados obrigatórios faltando** - Alguns campos obrigatórios não estão sendo enviados
3. **Problema de sincronização** - O carrinho pode estar sendo limpo antes da criação do pedido

## 🛠️ Soluções Implementadas

### 1. **Logs Detalhados na API** (`api/index.ts`)

#### ✅ Validação de Dados Obrigatórios
```javascript
// Validar sessionId
if (!req.body.sessionId) {
  return res.status(400).json({ 
    error: 'sessionId é obrigatório',
    received: req.body 
  });
}

// Validar customerName
if (!req.body.customerName) {
  return res.status(400).json({ 
    error: 'customerName é obrigatório',
    received: req.body 
  });
}
```

#### ✅ Logs de Debug do Carrinho
```javascript
console.log('🛒 Buscando itens do carrinho para sessionId:', req.body.sessionId);
console.log('📦 Itens encontrados no carrinho:', cartItems.length);
console.log('📦 Total de itens em memória:', cartItems.length);
```

### 2. **Arquivos de Teste Criados**

#### ✅ `test-cart-debug.html`
- Interface web para debug específico do carrinho
- Testes passo a passo
- Verificação do sessionId padrão

#### ✅ `fix-cart-issue.js`
- Script Node.js para testar o problema
- Simulação completa do fluxo
- Debug detalhado

## 📋 Passos para Resolver

### 1. **Testar Localmente**

Execute o script de teste:
```bash
node fix-cart-issue.js
```

### 2. **Testar no Vercel**

Acesse: `https://seu-dominio.vercel.app/test-cart-debug`

### 3. **Verificar Logs**

No Dashboard do Vercel:
1. Vá em **Functions**
2. Clique na função `/api/index`
3. Verifique os logs para identificar o problema específico

## 🔍 Diagnóstico Esperado

### Logs de Sucesso
```
📦 Recebendo requisição para criar pedido...
📋 Body da requisição: { sessionId: "wil3rxwaf0q", ... }
🛒 Buscando itens do carrinho para sessionId: wil3rxwaf0q
📦 Itens encontrados no carrinho: 1
✅ Dados válidos, criando pedido...
✅ Pedido criado com sucesso, ID: 1
```

### Logs de Erro (Carrinho Vazio)
```
📦 Recebendo requisição para criar pedido...
🛒 Buscando itens do carrinho para sessionId: wil3rxwaf0q
📦 Itens encontrados no carrinho: 0
❌ Carrinho vazio para sessionId: wil3rxwaf0q
```

## 🚨 Possíveis Causas e Soluções

### 1. **Carrinho Vazio**
**Sintoma:** `"Carrinho vazio"`
**Solução:** 
- Verificar se produtos estão sendo adicionados ao carrinho
- Verificar se o sessionId está correto
- Testar adição manual de produtos

### 2. **Dados Obrigatórios Faltando**
**Sintoma:** `"sessionId é obrigatório"` ou `"customerName é obrigatório"`
**Solução:**
- Verificar se todos os campos estão sendo enviados
- Verificar se o formulário está preenchido corretamente

### 3. **Problema de Sincronização**
**Sintoma:** Carrinho tem itens mas pedido falha
**Solução:**
- Verificar se o carrinho não está sendo limpo antes do pedido
- Verificar se há múltiplas requisições simultâneas

## 🧪 Testes Implementados

### 1. **Teste de SessionId**
- Verifica se o sessionId está correto
- Verifica localStorage

### 2. **Teste de Adição ao Carrinho**
- Adiciona produto ao carrinho
- Verifica se foi adicionado corretamente

### 3. **Teste de Verificação do Carrinho**
- Lista todos os itens do carrinho
- Verifica se há itens para o sessionId

### 4. **Teste de Criação de Pedido**
- Tenta criar pedido com dados completos
- Verifica se PIX é gerado

### 5. **Debug Completo**
- Executa todos os testes em sequência
- Gera relatório detalhado

## 🔧 Correções Implementadas

### 1. **Melhor Tratamento de Erros**
```javascript
res.status(400).json({ 
  error: 'Carrinho vazio',
  sessionId: req.body.sessionId,
  cartItemsCount: cartItems.length
});
```

### 2. **Logs Detalhados**
```javascript
console.log('📦 Recebendo requisição para criar pedido...');
console.log('📋 Body da requisição:', JSON.stringify(req.body, null, 2));
```

### 3. **Validação Completa**
```javascript
// Validar todos os campos obrigatórios
if (!req.body.sessionId) { /* erro */ }
if (!req.body.customerName) { /* erro */ }
if (!req.body.customerEmail) { /* erro */ }
if (!req.body.total) { /* erro */ }
```

## 📊 Próximos Passos

1. **Execute os testes** para identificar o problema específico
2. **Verifique os logs** no Vercel Dashboard
3. **Teste localmente** primeiro para isolar o problema
4. **Implemente correções** baseadas nos resultados dos testes

## 📞 Suporte

Se o problema persistir:

1. **Execute o arquivo de teste** `test-cart-debug.html`
2. **Verifique os logs** no Dashboard do Vercel
3. **Teste localmente** com `node fix-cart-issue.js`
4. **Compartilhe os logs** para análise detalhada

---

**Status:** ✅ Implementado e pronto para teste
**Última atualização:** $(date) 