# 🚀 Deploy no Vercel - Guia Completo

## ✅ Arquivos Já Configurados

Você já tem tudo pronto para deploy no Vercel:

- ✅ `vercel.json` - Configuração do deployment
- ✅ `api/index.ts` - API serverless com Express
- ✅ Build command correto: `vite build`
- ✅ Output directory: `dist`

## 📋 Configurações no Painel Vercel

### 1. Build & Output Settings (como na sua imagem):
```
Build Command: vite build ✓
Output Directory: dist ✓
Install Command: yarn install, pnpm install, npm install, or bun install ✓
```

### 2. Environment Variables (OBRIGATÓRIO):
```
Name: BLACKCAT_API_KEY
Value: [sua_chave_blackcat]
```

### 3. Node.js Version:
```
Node.js Version: 18.x ou 20.x
```

## 🔧 Configurações Extras (Opcionais)

Se quiser otimizar, adicione também:

```
UTMIFY_API_KEY: [sua_chave_utmify] (opcional)
NODE_ENV: production (automático)
```

## 🚀 Como Fazer Deploy

1. **Conectar Repository**:
   - Vá em vercel.com
   - Import seu projeto do GitHub/GitLab
   - Escolha este repositório

2. **Configurar Build**:
   - Build Command: `vite build`
   - Output Directory: `dist`  
   - Install Command: (deixar automático)

3. **Adicionar Environment Variables**:
   - Settings → Environment Variables
   - Adicionar `BLACKCAT_API_KEY`

4. **Deploy**:
   - Clique em "Deploy"
   - Aguardar o build completar

## ✅ O Que Funciona no Vercel

- ✅ Frontend React com Vite
- ✅ API serverless com Express
- ✅ PIX payments via BlackCat
- ✅ Carrinho de compras
- ✅ Checkout completo
- ✅ 16 produtos (6 queijos + 10 doces)

## 🔗 URLs Após Deploy

- **Site**: https://seu-projeto.vercel.app
- **API**: https://seu-projeto.vercel.app/api/products
- **Checkout**: https://seu-projeto.vercel.app/api/orders

## 🐛 Troubleshooting

Se o deploy falhar:

1. **Build Error**: Verifique se `vite build` roda local
2. **API Error**: Confirme se `BLACKCAT_API_KEY` está configurada
3. **404 Error**: Confirme `Output Directory` = `dist`

## 💡 Dicas Importantes

- **Deploy automático**: Cada push no main = novo deploy
- **Preview deploys**: Branches = deploys de preview  
- **Logs**: Function logs disponíveis no dashboard
- **Performance**: Edge functions para melhor speed

Está tudo pronto! Só configurar no painel e fazer deploy! 🎉