# Revite

A fullstack website build with vike

## Features

- react
- vike
- tailwindcss
- shadcn
- lucide icon
- prisma
- sqlite
- auth

## How to use

### 1. initiate

```sh
git clone https://github.com/geoochi/revite.git
cd revite
```

### 2. install dependencies and set environment variables

```sh
cd client
pnpm i
cp .env.example .env
# set your own environment variables
```

```sh
cd ../server
pnpm i
cp .env.example .env
# set your own environment variables
pnpm prisma db push
pnpm prisma generate
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
