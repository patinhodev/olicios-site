# Arquitetura

## Visão geral

O projeto é uma aplicação única e sem banco de dados. O Spring Boot inicializa um servidor HTTP e entrega os arquivos do frontend empacotados no JAR durante a construção da imagem Docker.

```text
Navegador
    │ HTTP/HTTPS
    ▼
Spring Boot 3 / Java 21
    │ recursos estáticos no classpath
    ▼
HTML + CSS + JavaScript + imagens
```

## Backend

O código está em `backend/src/main/java`. A aplicação não expõe formulário, autenticação nem API de dados. A porta utiliza `PORT` quando informada pelo ambiente e `8080` como padrão local.

## Frontend

O código está em `frontend`. O JavaScript controla as galerias de eventos, as preferências de cookies e o carregamento consentido do Google Analytics.

## Construção

O `Dockerfile` copia o frontend para `backend/src/main/resources/static` apenas dentro da etapa de construção. O diretório de desenvolvimento permanece separado e o artefato final é executado por usuário sem privilégios administrativos.
