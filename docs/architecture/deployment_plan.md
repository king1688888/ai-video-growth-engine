# 部署计划

> 日期：2026-05-26

---

## 部署拓扑

| 组件 | 平台 | 理由 |
|------|------|------|
| 前端 (Next.js) | Vercel | 零配置、全球 CDN、自动 HTTPS |
| 后端 API (NestJS) | Railway / Render | Docker 支持、自动扩缩、PostgreSQL/Redis 托管 |
| Python Worker | Railway / Render | Docker 部署、可独立扩缩 |
| PostgreSQL | Railway / Render 托管 | 自动备份、连接池 |
| Redis | Railway / Render 托管 | BullMQ 队列 + 缓存 |
| 对象存储 | Cloudflare R2 | S3 兼容、零出流量费 |
| 监控 | Sentry + Grafana Cloud Free | 错误追踪 + 指标 |

## 环境

| 环境 | 用途 | 部署方式 |
|------|------|----------|
| `local` | 本地开发 | Docker Compose |
| `staging` | 预发测试 | 自动部署（PR merge to main） |
| `production` | 生产 | 手动触发 / Tag 触发 |

## Docker 化

```text
docker/
├── docker-compose.yml          # 本地开发全栈
├── docker-compose.test.yml     # 测试环境
├── Dockerfile.api              # NestJS API
├── Dockerfile.worker-node      # Node Worker (Orchestrator/Billing/Risk)
├── Dockerfile.worker-python    # Python Worker (Video/AI)
└── Dockerfile.frontend         # Next.js (生产构建)
```

## 环境变量管理

| 环境 | 方式 |
|------|------|
| 本地 | `.env.local`（gitignored） |
| CI | GitHub Secrets |
| 部署 | 平台环境变量（Railway/Render/Vercel） |

## 扩缩策略

| 组件 | MVP1 规格 | 扩缩触发 |
|------|-----------|----------|
| API | 1 实例 512MB | 请求延迟 > 2s |
| Node Worker | 1 实例 512MB | 队列积压 > 100 |
| Python Worker | 1 实例 1GB | 队列积压 > 50 |
| PostgreSQL | 1GB RAM | 连接数 > 80% |
| Redis | 256MB | 内存 > 80% |

## 迁移到云服务器路径

MVP1 使用 PaaS 快速上线。商业化规模扩大后可迁移到：
- 阿里云 ECS + RDS + OSS + 容器服务
- AWS EC2 + RDS + S3 + ECS

架构已 Docker 化，迁移成本低。

---

*本文档为 MVP1 架构冻结版本。*
