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

```sh
cd client
pnpm install
cp .env.example .env
# set your own environment variables
```

```sh
cd ../server
pnpm install
cp .env.example .env
# set your own environment variables
pnpm prisma db push
```

### 3. run dev server

terminal 1

```sh
cd ../client
pnpm d
```

terminal 2

```sh
cd ../server
pnpm d
```

### 4. run prisma studio (optional)

terminal 3

```sh
cd ../server
pnpm q
```

### 5. open website

open http://localhost:3000/
