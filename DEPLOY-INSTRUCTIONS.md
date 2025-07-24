# 🚀 Instruções de Deploy - Tábua de Minas

## Projeto Organizado para Netlify

O projeto está **100% pronto** para hospedagem no Netlify! Todos os arquivos necessários foram criados e configurados.

### 📁 Arquivos Criados para Deploy

✅ **netlify.toml** - Configuração principal do Netlify  
✅ **build-netlify.sh** - Script de build automatizado  
✅ **_redirects** - Redirecionamentos para SPA  
✅ **netlify/functions/** - APIs serverless  
✅ **.env.example** - Exemplo de variáveis de ambiente  
✅ **README-NETLIFY.md** - Guia completo de deploy  

### 🎯 Como Fazer o Deploy

#### Opção 1: Deploy via Git (Recomendado)

1. **Subir para Git**:
   ```bash
   git add .
   git commit -m "Projeto pronto para Netlify"
   git push origin main
   ```

2. **Conectar no Netlify**:
   - Acesse [netlify.com](https://netlify.com)
   - "New site from Git" 
   - Conecte seu repositório
   - Build command: `./build-netlify.sh`
   - Publish directory: `dist`

3. **Configurar Variáveis**:
   - Site settings > Environment variables
   - Adicionar as chaves da API (BlackCat, UTMify)

#### Opção 2: Deploy Manual

```bash
# Instalar CLI do Netlify
npm install -g netlify-cli

# Fazer login
netlify login

# Build local
./build-netlify.sh

# Deploy
netlify deploy --prod --dir=dist
```

### 🔧 APIs Funcionais

- ✅ `/api/products` - Lista completa de produtos
- ✅ `/api/cart` - Carrinho de compras funcional  
- ✅ `/api/orders` - Criação de pedidos
- ✅ Todas as funcionalidades do e-commerce

### 🎨 Interface Completa

- ✅ 26 produtos autênticos (17 queijos + 9 doces)
- ✅ Sistema de carrinho com variantes (500g/1kg)
- ✅ Checkout com PIX integrado
- ✅ Clube de assinatura Tábua
- ✅ Reviews e avaliações
- ✅ Design responsivo otimizado

### ⚡ Performance

- ✅ Build otimizado com Vite
- ✅ Funções serverless eficientes
- ✅ CDN global do Netlify
- ✅ Cache automático

### 📱 Resultado Final

Após o deploy, você terá:
- **Site público**: `https://seu-site.netlify.app`
- **E-commerce funcional** com todos os recursos
- **APIs em produção** para produtos e carrinho
- **Interface moderna** otimizada para conversão

---

**🎉 Projeto 100% Pronto para Produção!**

O site está completamente organizado e funcional para ser hospedado no Netlify. Basta seguir os passos acima para ter seu e-commerce online!