# Revike

A fullstack SSG/SSR website build with vike

## Features

- react
- vike SSG/SSR
- tailwindcss
- shadcn
- lucide icon
- prisma
- sqlite
- auth

## How to use

### 1. initiate

```bash
git clone https://github.com/geoochi/revike.git
cd revike
pnpm install && pnpm approve-builds
```

### 2. initiate db

```bash
cp .env.example .env
# edit .env
```

```bash
pnpm init:db
```

### 3. development

```bash
pnpm d
```

### 4. build

```bash
pnpm b
```

### 5. production(SSG, no server & db)

```bash
pnpm p
```

### 6. production(SSR, with server & db)

```bash
pnpm start
```

### 7. db monitor(optional)

```bash
pnpm q
```

### 8. remote deploy

```bash
chmod +x start stop && pnpm b
```

start server:

```bash
./start
```

stop server:

```bash
./stop
```
