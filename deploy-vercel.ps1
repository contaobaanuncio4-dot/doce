Write-Host "🚀 Deploy Tábua de Minas - Vercel" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Verificar se o Vercel CLI está instalado
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
        npm install -g vercel
    } else {
        Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro ao verificar Vercel CLI" -ForegroundColor Red
    exit 1
}

# Verificar se está logado no Vercel
Write-Host "🔐 Verificando login no Vercel..." -ForegroundColor Cyan
try {
    vercel whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Não logado no Vercel. Faça login primeiro:" -ForegroundColor Red
        Write-Host "   vercel login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Logado no Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao verificar login" -ForegroundColor Red
    exit 1
}

# Verificar variáveis de ambiente
Write-Host "🔍 Verificando variáveis de ambiente..." -ForegroundColor Cyan
if ([string]::IsNullOrEmpty($env:BLACKCAT_API_KEY)) {
    Write-Host "⚠️  BLACKCAT_API_KEY não configurada localmente" -ForegroundColor Yellow
    Write-Host "   Configure no Vercel Dashboard após o deploy" -ForegroundColor Yellow
} else {
    Write-Host "✅ BLACKCAT_API_KEY configurada localmente" -ForegroundColor Green
}

# Build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Cyan
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro no build. Verifique os erros acima." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build concluído" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro durante o build" -ForegroundColor Red
    exit 1
}

# Deploy no Vercel
Write-Host "🚀 Fazendo deploy no Vercel..." -ForegroundColor Cyan
try {
    vercel --prod
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
        Write-Host "1. Configure BLACKCAT_API_KEY no Vercel Dashboard" -ForegroundColor White
        Write-Host "2. Teste a API: https://seu-dominio.vercel.app/test-vercel-api.html" -ForegroundColor White
        Write-Host "3. Verifique os logs no Dashboard do Vercel" -ForegroundColor White
        Write-Host ""
        Write-Host "🔗 Links úteis:" -ForegroundColor Cyan
        Write-Host "- Dashboard Vercel: https://vercel.com/dashboard" -ForegroundColor White
        Write-Host "- Logs da função: https://vercel.com/dashboard/[projeto]/functions" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Erro no deploy. Verifique os logs acima." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro durante o deploy" -ForegroundColor Red
    exit 1
} 