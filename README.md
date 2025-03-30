# Revite

A fullstack website build with react, vite, tailwindcss, shadcn, lucide icon, prisma, sqlite

## Features

- react
- vite
- tailwindcss
- shadcn
- lucide icon
- prisma
- sqlite

## How to use

### 1. initiate

```sh
git clone https://github.com/geoochi/revite.git
cd revite
```

### 2. install dependencies and set environment variables

client:

```sh
pnpm install
cp .env.example .env
# set your own environment variables
```

server:

```sh
pnpm install
cp .env.example .env
# set your own environment variables
pnpm prisma db push
```

### 3. development

client:

```sh
pnpm d
```

server:

```sh
pnpm d
```

### 4. production

client:

```sh
pnpm b
# modify the server url in client/.env
pnpm p
```

server:

```sh
pnpm b
pnpm p-remote
```
