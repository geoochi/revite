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
bun i
cp .env.example .env
# set your own environment variables
```

```sh
cd ../server
bun i
cp .env.example .env
# set your own environment variables
bun prisma db push
bun prisma generate
```

### 3. run dev server

terminal 1

```sh
cd ../client
bun d
```

terminal 2

```sh
cd ../server
bun d
```

### 4. run prisma studio (optional)

terminal 3

```sh
cd ../server
bun q
```

### 5. open website

open http://localhost:3000/
