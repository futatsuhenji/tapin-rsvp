# Tap'n出欠

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Build](https://github.com/futatsuhenji/tapin-rsvp/actions/workflows/build.yml/badge.svg)](https://github.com/futatsuhenji/tapin-rsvp/actions/workflows/build.yml)
[![Test](https://github.com/futatsuhenji/tapin-rsvp/actions/workflows/test.yml/badge.svg)](https://github.com/futatsuhenji/tapin-rsvp/actions/workflows/test.yml)  
![Next.js](https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-000000.svg?logo=tailwindcss&style=for-the-badge)
![React](https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/-TypeScript-000000.svg?style=for-the-badge&logo=typescript&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/-Postgresql-336791.svg?logo=postgresql&style=for-the-badge&logoColor=white)
![Redis](https://img.shields.io/badge/-Redis-DC382D.svg?logo=redis&style=for-the-badge&logoColor=white)

メールでのイベント出欠調査を楽々に。招待メールに埋め込まれたボタンをワンクリックするだけで回答完了。  
返信メールの管理も集計作業も不要なWebサービスです。当日の受付や会費徴収サポートにも対応！

## 技術スタック

- Next.js
- Tailwind CSS
- PostgreSQL
- Redis
- Prisma (Drizzleに移行予定)
- Hono + Zod (削除予定)

Next.js、および関連するマーク、デザイン、ロゴは、米国およびその他の国における Vercel, Inc. またはその関連会社の商標または登録商標です。  
Tailwindの名称およびロゴは、Tailwind Labs Inc.の商標です。   
Postgres 、PostgreSQL、およびSlonikロゴは、PostgreSQL Community Association of Canadaの商標または登録商標であり、同協会の許可を得て使用しています。  
RedisはRedis Ltd.の登録商標です。Redis Ltd.に関するすべての権利はRedis Ltd.に帰属します。  
PrismaはPrisma Data, Inc.の商標です。

> [!NOTE]
> 本ソフトウェアおよび本サービスは、各商標権者とは提携・関係しておらず、各商標権者による推奨、承認または認定を受けたものではありません。

## 実行

### 開発環境

本プロジェクトの開発環境は [VSCode Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) によって管理されています。

```sh
pnpm dev
```

### 本番環境

1. `compose.override.yml.sample` をもとに `compose.override.yml` を作成
2.
```sh
docker compose up --build
```
