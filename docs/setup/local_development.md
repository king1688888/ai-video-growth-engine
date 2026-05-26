# 本地开发指南

> 日期：2026-05-26

---

## 前置要求

| 工具 | 版本 | 安装 |
|------|------|------|
| Node.js | ≥ 20.0.0 | https://nodejs.org |
| pnpm | ≥ 9.0.0 | `npm install -g pnpm` |
| Docker | ≥ 24.0 | https://docker.com |
| Docker Compose | ≥ 2.20 | 随 Docker Desktop 安装 |

## 快速启动

```bash
# 1. 克隆仓库
git clone https://github.com/king1688888/ai-video-growth-engine.git
cd ai-video-growth-engine

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local

# 4. 启动基础设施（PostgreSQL + Redis + MinIO）
docker compose up -d

# 5. 等待服务就绪
docker compose ps  # 确认所有服务 healthy

# 6. 启动开发服务
pnpm dev
```

## 各服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 (Next.js) | http://localhost:3000 | Web UI |
| API (NestJS) | http://localhost:3001 | 后端 API |
| API 健康检查 | http://localhost:3001/api/v1/health | 健康状态 |
| PostgreSQL | localhost:5432 | 数据库 |
| Redis | localhost:6379 | 缓存/队列 |
| MinIO Console | http://localhost:9001 | 对象存储管理 |
| MinIO API | http://localhost:9000 | S3 兼容 API |

## 常用命令

```bash
# 开发
pnpm dev              # 启动所有服务（turbo）
pnpm build            # 构建所有包
pnpm lint             # 代码检查
pnpm typecheck        # 类型检查
pnpm test             # 运行测试
pnpm format           # 格式化代码

# Docker
pnpm docker:up        # 启动基础设施
pnpm docker:down      # 停止基础设施

# 数据库（后续配置 Prisma 后可用）
pnpm db:generate      # 生成 Prisma Client
pnpm db:migrate       # 运行迁移
```

## 目录结构

```
ai-video-growth-engine/
├── apps/
│   ├── api/          # NestJS 后端 API
│   ├── web/          # Next.js 前端
│   └── worker/       # Node.js Worker（编排/计费/风控）
├── packages/
│   ├── shared/       # 共享类型、常量、错误码
│   ├── database/     # Prisma Schema + 迁移
│   ├── ai-core/      # AI 编排核心逻辑
│   ├── prompts/      # Prompt Registry
│   ├── risk/         # 风控质检
│   ├── billing/      # 积分计费
│   └── testing/      # 测试工具和 fixtures
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── .env.example
```

## 注意事项

1. 不要提交 `.env.local` 文件
2. 不要使用真实 API Key 进行本地开发
3. MinIO 模拟 S3，生产使用 Cloudflare R2
4. `FEATURE_MOCK_AI=true` 仅在开发环境启用

---

*本文档由 Manus Agent 自动生成。*
