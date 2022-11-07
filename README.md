# API-Tenant-v1

## Requirements

- yarn
- @nest/cli `npm i -g @nestjs/cli`

## Installation

1. Install dependencies

```bash
yarn
```

2. Enable a development database **Postgres**
3. Create the environment variables file (.env.development) and complete

## Running the app

```bash
# development
yarn dev

# production mode
yarn build
```

## Test

```bash
# unit tests
yarn test
```

### NestJS

Crear nuevo modulo

```bash
nest g mo module/[name-module]
```

Crear nuevo submodulo

```bash
nest g res module/[name-module]/[name-submodule]
# Select CRUD
```

## DTO

El nombre del dto `[methode-controller]-[name-module].dto.ts`, usando minusculas.

## TypeORM

Create new migration

> **NOTE:** You must have a database connection configured in the `ormconfig.json` file

> **NOTE:** Run `yarn build` before running the migration

```bash
$ npx typeorm migration:generate -n entities-[name-module]
# el nombre del modulo debe separarse por guiones
```

Run existing migrations

```bash
$ npx typeorm migration:run
```
