#!/bin/bash

echo "🚀 Deploy Tábua de Minas - Vercel"
echo "=================================="

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
echo "🔐 Verificando login no Vercel..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Não logado no Vercel. Faça login primeiro:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logado no Vercel"

# Verificar variáveis de ambiente
echo "🔍 Verificando variáveis de ambiente..."
if [ -z "$BLACKCAT_API_KEY" ]; then
    echo "⚠️  BLACKCAT_API_KEY não configurada localmente"
    echo "   Configure no Vercel Dashboard após o deploy"
else
    echo "✅ BLACKCAT_API_KEY configurada localmente"
fi

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

echo "✅ Build concluído"

# Deploy no Vercel
echo "🚀 Fazendo deploy no Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deploy concluído com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Configure BLACKCAT_API_KEY no Vercel Dashboard"
    echo "2. Teste a API: https://seu-dominio.vercel.app/test-vercel-api.html"
    echo "3. Verifique os logs no Dashboard do Vercel"
    echo ""
    echo "🔗 Links úteis:"
    echo "- Dashboard Vercel: https://vercel.com/dashboard"
    echo "- Logs da função: https://vercel.com/dashboard/[projeto]/functions"
    echo ""
else
    echo "❌ Erro no deploy. Verifique os logs acima."
    exit 1
fi 