# Revite

A fullstack website build with react, vite, tailwindcss, shadcn, lucide icon, prisma, sqlite

## Features

- vue 3
- vite-ssg 26
- tailwindcss 4
- shadcn-vue 2
- lucide icon
- prisma
- sqlite

## How to use

### 1. initiate

```sh
git clone https://github.com/geoochi/revite.git
cd revite
git checkout front-back
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

### 3. set nginx

```nginx
# frontend backend development server
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
server {
    listen 80;
    listen [::]:80;
    server_name localhost;
    # server_name <YOUR_PRODUCTION_DOMAIN>;

    # frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

    }

    # backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header REMOTE_ADDR $remote_addr;
    }
}
```

### 4. development

client:

```sh
pnpm d
```

server:

```sh
pnpm d
```

### 5. production

client:

```sh
pnpm b
pnpm p
```

server:

```sh
pnpm b
pnpm p
```
