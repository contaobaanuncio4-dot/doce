# Tábua de Minas - Netlify Deployment Guide

Este projeto está configurado para deploy no Netlify com funções serverless.

## 📋 Pré-requisitos

1. Conta no Netlify
2. Repositório Git (GitHub, GitLab, etc.)
3. Variáveis de ambiente configuradas

## 🚀 Deploy Rápido

### 1. Conectar ao Netlify

1. Faça login no [Netlify](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu repositório
4. Configure as opções de build:
   - **Build command**: `./build-netlify.sh`
   - **Publish directory**: `dist`

### 2. Configurar Variáveis de Ambiente

No painel do Netlify, vá em **Site settings > Environment variables** e adicione:

```
BLACKCAT_API_KEY=your_blackcat_api_key
BLACKCAT_API_SECRET=your_blackcat_api_secret
UTMIFY_API_TOKEN=your_utmify_token
SESSION_SECRET=your_session_secret
```

### 3. Deploy Manual (CLI)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Build local
./build-netlify.sh

# Deploy
netlify deploy --prod --dir=dist
```

## 🏗️ Estrutura do Projeto para Netlify

```
├── netlify/
│   └── functions/
│       ├── products.ts    # API de produtos
│       ├── cart.ts        # API do carrinho
│       ├── orders.ts      # API de pedidos
│       └── storage.ts     # Storage em memória
├── netlify.toml          # Configuração do Netlify
├── build-netlify.sh      # Script de build
└── _redirects           # Redirecionamentos
```

## 🔧 Funcionalidades

### APIs Serverless
- ✅ `/api/products` - Lista de produtos
- ✅ `/api/cart` - Gerenciamento do carrinho
- ✅ `/api/orders` - Criação de pedidos

### Recursos
- ✅ Storage em memória (funcional para demo)
- ✅ Interface de e-commerce completa
- ✅ Sistema de carrinho
- ✅ Checkout com PIX
- ✅ Responsivo e otimizado

## ⚠️ Limitações do Netlify

1. **Storage**: Usa memória (dados resetam a cada função)
2. **Sessões**: Simplificadas para demo
3. **Database**: Para produção, conectar a banco externo

## 🔄 Para Produção

Para uma versão de produção robusta:

1. Configurar banco de dados (Supabase, PlanetScale, etc.)
2. Implementar autenticação persistente
3. Configurar storage de sessões
4. Adicionar logs e monitoramento

## 📱 URLs da Aplicação

Após o deploy:
- **Site**: `https://seu-site.netlify.app`
- **API**: `https://seu-site.netlify.app/api/products`

## 🐛 Troubleshooting

### Build falha
```bash
# Dar permissão ao script
chmod +x build-netlify.sh
```

### Funções não funcionam
- Verificar logs em Netlify Dashboard > Functions
- Verificar variáveis de ambiente
- Verificar sintaxe do `netlify.toml`

### 404 em rotas
- Verificar `_redirects` e `netlify.toml`
- SPA routing configurado para React Router

## 📞 Suporte

Para dúvidas sobre o deploy, verificar:
1. Logs do build no Netlify
2. Console do navegador
3. Function logs no dashboard