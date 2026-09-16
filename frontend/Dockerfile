# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base

# 依存パッケージインストールステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ビルドステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ビルド時環境変数の受け取り (Vite 用)
ARG VITE_API_BASE_URL
ARG VITE_SITE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

# アプリケーションのビルド (TypeScript型チェック + Viteバンドル)
RUN npm run build

# 本番配信ステージ (Nginx による静的配信)
FROM nginx:1.27-alpine AS runner

# Nginx 設定ファイルの配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルド成果物のコピー
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
