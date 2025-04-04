# Revite

A fullstack website build with react, vite, tailwindcss, shadcn, lucide icon, prisma, sqlite

## Features

- nuxt
- tailwindcss
- lucide icon
- prisma
- sqlite

## How to use

### 1. initiate

```sh
git clone https://github.com/geoochi/revite
cd revite
git checkout fullstack
```

### 2. install dependencies and set environment variables

```sh
pnpm install
cp .env.example .env
# set your own environment variables
pnpm prisma db push
```

### 3. development

```sh
pnpm d
```

### 4. production

```sh
pnpm b
pnpm start
```
