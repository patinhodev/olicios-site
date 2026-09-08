# Restaurante Olicio's

Site institucional do Restaurante Olicio's, em Teresópolis/RJ. A aplicação utiliza Java 21 com Spring Boot para servir um frontend estático responsivo, incluindo apresentação do restaurante, especialidades, história, eventos, contato, delivery e consentimento para Google Analytics.

## Tecnologias

- Java 21 e Spring Boot 3.
- HTML5, CSS3 e JavaScript sem framework.
- Maven para construção e testes do backend.
- Docker e Docker Compose para execução local.
- Prettier para padronização do frontend e da documentação.
- GitHub Actions para integração contínua e análise de segurança.

## Estrutura

```text
.
├── .github/                 Workflows e automação do GitHub
├── backend/                 Aplicação Java/Spring Boot
│   └── src/
│       ├── main/            Código e configuração da aplicação
│       └── test/            Testes automatizados
├── docs/                    Arquitetura, implantação e segurança
├── frontend/                Site estático e ativos de produção
│   └── assets/images/       Imagens utilizadas pelo site
├── scripts/                 Validações locais reproduzíveis
├── Dockerfile               Imagem para execução local
├── Dockerfile.vercel        Imagem destinada à Vercel
├── docker-compose.yml       Orquestração local
└── package.json             Ferramentas de qualidade do frontend
```

## Pré-requisitos

- Docker Desktop; ou
- Java 21, Maven 3.9+, Node.js 22+ e npm.

## Executar com Docker

```powershell
docker compose up -d --build
```

Acesse `http://localhost:8282`.

Para acompanhar os registros:

```powershell
docker compose logs -f web
```

Para encerrar:

```powershell
docker compose down
```

## Qualidade e testes

Instale as ferramentas de desenvolvimento:

```powershell
npm ci
```

Execute todas as verificações de frontend:

```powershell
npm run check
```

Execute os testes Java quando Maven estiver instalado:

```powershell
mvn -f backend/pom.xml verify
```

O GitHub Actions repete essas verificações automaticamente em cada envio e pull request.

## Google Analytics

O Google Analytics 4 está configurado com o identificador público de medição do restaurante. A tag permanece bloqueada até que o visitante aceite os cookies e é carregada por `frontend/privacy-consent.js`:

```js
window.OLICIOS_ANALYTICS_ID = "G-XCHBB8TYF6";
```

Os sinais de publicidade e personalização permanecem desativados. O identificador de medição `G-...` é público e não representa uma chave secreta.

## Implantação

As instruções de publicação e validação estão em `docs/DEPLOYMENT.md`.

## Segurança

Consulte `SECURITY.md` para comunicar vulnerabilidades de maneira responsável. As verificações automatizadas ajudam a reduzir riscos, mas não substituem uma avaliação profissional autorizada.
