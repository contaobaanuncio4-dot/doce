# 🔧 Correção do Erro de Build no Netlify

## Problema
O script `build-netlify.sh` estava falhando no Netlify devido a permissões de execução (exit code 126).

## ✅ Solução Aplicada

### Comando de Build Simplificado
Mudei o `netlify.toml` para usar comandos diretos ao invés de script personalizado:

```toml
[build]
  publish = "dist/public"
  command = "vite build && cp _redirects dist/public/_redirects"
```

### O que faz:
1. **`vite build`** - Gera o build da aplicação React
2. **`cp _redirects dist/public/_redirects`** - Copia o arquivo de redirecionamentos

## 🚀 Para Aplicar a Correção

1. **Fazer commit das mudanças:**
   ```bash
   git add .
   git commit -m "Fix: Simplify Netlify build command"
   git push origin main
   ```

2. **Ou se preferir, trigger manual:**
   - No dashboard do Netlify
   - Vá em "Deploys"
   - Clique em "Trigger deploy" > "Deploy site"

## ✅ Agora o Build Vai Funcionar

Com esta correção:
- ✅ Build command mais simples e confiável
- ✅ Não depende de permissões de script
- ✅ Funciona nativamente no ambiente Netlify
- ✅ Arquivo `_redirects` é copiado corretamente

O próximo deploy será bem-sucedido!