# Configuração de Variáveis de Ambiente no Netlify

Para o PIX funcionar corretamente no Netlify, você precisa configurar a chave da API BlackCat:

## Passos para configurar:

1. **Acesse o painel do Netlify**
   - Vá para https://app.netlify.com
   - Selecione seu site

2. **Configure as variáveis de ambiente**
   - Vá em "Site settings" → "Environment variables"
   - Clique em "Add variable"

3. **Adicione a chave da API**
   - Key: `BLACKCAT_API_KEY`
   - Value: [sua chave da API BlackCat]

4. **Deploy novamente**
   - Após adicionar a variável, faça um novo deploy do site

## Importante:
- Sem a chave `BLACKCAT_API_KEY` configurada, o PIX não funcionará
- O erro "Erro ao criar o pedido" indica que a API não consegue se autenticar
- Após configurar, teste novamente o checkout

## Como obter a chave BlackCat:
1. Acesse https://blackcat.exchange
2. Faça login ou crie uma conta
3. Vá para as configurações da API
4. Copie sua chave de API