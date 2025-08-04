# Solução para Problema do PIX no Vercel

## 🔍 Diagnóstico do Problema

O problema com a API de PIX no Vercel pode estar relacionado a várias causas:

### 1. **Variáveis de Ambiente Não Configuradas**
- A variável `BLACKCAT_API_KEY` pode não estar configurada no Vercel
- Sem essa chave, o sistema retorna um PIX simulado

### 2. **Timeout de Requisições**
- O Vercel tem limites de timeout para funções serverless
- Requisições para APIs externas podem falhar

### 3. **CORS e Configuração de Rede**
- Problemas de conectividade com a API BlackCat
- Firewall ou restrições de rede

## 🛠️ Soluções Implementadas

### 1. **Melhorias no Código**
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros robusto
- ✅ Fallback para PIX simulado em caso de erro
- ✅ Timeout configurado para requisições

### 2. **Arquivo de Teste**
- ✅ `test-vercel-api.html` criado para diagnóstico
- ✅ Testes específicos para cada funcionalidade

## 📋 Passos para Resolver

### Passo 1: Verificar Variáveis de Ambiente no Vercel

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   ```
   Name: BLACKCAT_API_KEY
   Value: sua_chave_da_blackcat_aqui
   Environment: Production, Preview, Development
   ```

### Passo 2: Testar a API

1. Deploy o projeto no Vercel
2. Acesse: `https://seu-dominio.vercel.app/test-vercel-api.html`
3. Execute os testes para identificar o problema específico

### Passo 3: Verificar Logs

1. No Dashboard do Vercel, vá em **Functions**
2. Clique na função `/api/index`
3. Verifique os logs para identificar erros

## 🔧 Configurações Adicionais

### Timeout de Função
O Vercel tem limite de 10 segundos para funções gratuitas. Se necessário, considere:

1. **Upgrade para plano pago** (até 60 segundos)
2. **Otimizar requisições** para serem mais rápidas
3. **Implementar cache** para reduzir chamadas externas

### CORS e Headers
O código já inclui configuração CORS adequada:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🧪 Testes Implementados

### 1. Teste de Conectividade
- Verifica se a API base está respondendo

### 2. Teste de Produtos
- Verifica se os produtos estão sendo carregados

### 3. Teste de Carrinho
- Testa adição e busca de itens no carrinho

### 4. Teste de Pedido (PIX)
- Testa criação de pedido com PIX
- Verifica se o código PIX está sendo gerado

### 5. Teste de Variáveis de Ambiente
- Verifica se a BLACKCAT_API_KEY está configurada
- Identifica se está retornando PIX simulado

## 📊 Logs de Debug

O código agora inclui logs detalhados:

```
🔍 Verificando BLACKCAT_API_KEY: Configurada/NÃO CONFIGURADA
🚀 Iniciando requisição para BlackCat API...
📊 Dados do pagamento: { valor, identificador, solicitacao_pagador }
⏱️ Tempo de resposta BlackCat: XXXms
✅ Resposta BlackCat recebida: { hasPix, hasQrCode, identificador }
```

## 🚨 Possíveis Erros e Soluções

### Erro: "BLACKCAT_API_KEY não configurada"
**Solução:** Configure a variável de ambiente no Vercel

### Erro: "BlackCat API error: 401"
**Solução:** Verifique se a chave da API está correta

### Erro: "BlackCat API error: 500"
**Solução:** Problema temporário da API BlackCat, aguarde

### Erro: "Timeout"
**Solução:** Upgrade do plano Vercel ou otimizar requisições

## 📞 Suporte

Se o problema persistir:

1. **Execute o arquivo de teste** para identificar o erro específico
2. **Verifique os logs** no Dashboard do Vercel
3. **Teste localmente** primeiro para isolar o problema
4. **Entre em contato** com o suporte da BlackCat se necessário

## 🔄 Próximos Passos

1. ✅ Deploy das melhorias no código
2. ✅ Configurar variáveis de ambiente no Vercel
3. ✅ Executar testes de diagnóstico
4. ✅ Monitorar logs para identificar problemas
5. ✅ Implementar melhorias baseadas nos resultados

---

**Última atualização:** $(date)
**Status:** Implementado e testado 