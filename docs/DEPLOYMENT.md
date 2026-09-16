# Implantação

## Verificação local

Antes de publicar:

```powershell
npm ci
npm run check
docker compose build --no-cache
docker compose up -d
```

Confira `http://localhost:8282` em desktop e celular e valide galerias, links externos e consentimento de cookies.

## GitHub

Use a própria pasta `olicios` como raiz do repositório. Ela contém somente o código, os ativos e as configurações necessários para o site.

```powershell
git init
git add .
git status
git commit -m "Preparar site do Olicio's para produção"
```

Adicione o repositório remoto informado pelo GitHub e envie a branch principal somente depois de revisar `git status`.

## Cloudflare Pages

O site de produção é hospedado no Cloudflare Pages. Publique o conteúdo da pasta `frontend` e mantenha o arquivo `frontend/_headers`, que define os cabeçalhos de segurança aplicados pelo Cloudflare.

Após cada envio para a branch principal, acompanhe o deploy no painel do Cloudflare Pages e valide a URL de produção.

Depois da implantação, valide:

- carregamento por HTTPS;
- navegação e responsividade;
- links para WhatsApp, Instagram, Waze e Linktree;
- consentimento e recusa de cookies;
- cabeçalhos HTTP e registros da aplicação.

## Google Analytics

Crie uma propriedade GA4, copie o ID de medição e atualize `frontend/analytics-config.js`. Faça uma nova implantação e confirme no relatório em tempo real que visitas consentidas aparecem e visitas recusadas não carregam a tag.
