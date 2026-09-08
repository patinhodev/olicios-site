$ErrorActionPreference = "Stop"

npm ci
npm run check
docker compose build --no-cache

Write-Host "Verificações concluídas com sucesso."
