# 技术架构最终方案（Technical Architecture Final）

> 版本：V1.0 — 架构冻结  
> 日期：2026-05-26  
> 权威文档：D15（技术架构）、D16（数据库/API）、D17（异步任务）  
> 当前主线：MVP1 — 视频拆解 + 原创脚本生成

---

## 1. 架构模式

**模块化单体 + 异步任务队列 + 独立 Python Worker + Prompt/模型控制层**

MVP1 不做微服务拆分，但在代码、数据库、队列、API 层面保持清晰模块边界，确保后续可拆。

## 2. 技术栈冻结

| 层级 | 选型 | 理由 |
|------|------|------|
| Monorepo | pnpm workspace + Turborepo | 统一 Web/API/Worker/Shared |
| 前端 | Next.js 14+ App Router + TypeScript + Tailwind + shadcn/ui | SSR/SSG、API Route、D15 推荐 |
| 前端状态 | TanStack Query + Zustand | 服务端状态 + 局部 UI 状态 |
| 表单 | React Hook Form + Zod | 前后端 Schema 共享 |
| 后端 API | NestJS + TypeScript | 模块化、DI、Guard/Interceptor、BullMQ 集成成熟 |
| ORM | Prisma | 类型安全、迁移管理、AIcoding 友好 |
| 数据库 | PostgreSQL 15+ | 主业务、JSONB、pgvector 预留 |
| 缓存/队列 | Redis 7+ + BullMQ | 任务队列、限流、幂等锁、缓存 |
| 视频/AI Worker | Python 3.11+ + FastAPI + FFmpeg | 视频处理、ASR/OCR、模型调用辅助 |
| 对象存储 | S3-compatible（Cloudflare R2 首选，兼容 AWS S3/阿里 OSS） | 成本低、无出流量费 |
| AI 编排 | Prompt Registry + Model Router + Provider Adapter | 业务代码不直接调用模型 |
| 日志追踪 | OpenTelemetry + Structured Logs + Sentry | Trace ID 串联全链路 |
| 监控 | Prometheus + Grafana（或托管方案） | 任务成功率、成本、队列延迟 |
| CI/CD | GitHub Actions | lint/typecheck/test/build/deploy |
| 部署 | Vercel（前端）+ Railway/Render（NestJS API + Workers）+ Docker | 保留容器化迁移能力 |

## 3. 服务拓扑

```text
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                     │
│  Vercel / Docker                                         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│                  API Service (NestJS)                     │
│  Auth / RBAC / Task / Asset / Billing / Risk / Admin     │
│  Railway/Render / Docker                                 │
└───┬──────────┬──────────┬──────────┬────────────────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌────────┐ ┌─────────┐
│Redis  │ │Postgres│ │S3/R2   │ │BullMQ   │
│Cache  │ │  DB   │ │Storage │ │Queues   │
└───────┘ └───────┘ └────────┘ └────┬────┘
                                     │
              ┌──────────────────────┼──────────────────┐
              ▼                      ▼                  ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ Orchestrator    │  │ Python Video/AI  │  │ Risk/Billing │
│ Worker (Node)   │  │ Worker           │  │ Worker (Node)│
│ DAG/Dispatch    │  │ FFmpeg/ASR/OCR   │  │ Quality/Cost │
└─────────────────┘  │ Model Calls      │  └──────────────┘
                     └──────────────────┘
```

## 4. 关键架构决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 队列方案 | BullMQ（非 Temporal） | MVP1 复杂度不需要 Temporal；BullMQ 轻量、Redis 复用、NestJS 原生集成 |
| 前后端分离 | Next.js 前端 + NestJS 后端 | 关注点分离、后端可独立扩展、Worker 可独立部署 |
| Python Worker 通信 | BullMQ → Redis → Python Worker（通过 HTTP 回调或共享队列） | Python 处理视频/AI，Node 处理编排/计费/风控 |
| 对象存储 | R2 首选 | 零出流量费、S3 兼容、全球 CDN |
| 模型调用 | 统一通过 Model Router | 不允许业务代码直接调用 OpenAI/通义千问等 |
| 认证 | JWT + Refresh Token | 简单、无状态、适合 SPA |
| 幂等 | Idempotency-Key Header + DB 唯一约束 | 防重复扣费/创建 |

## 5. 不做事项

- 不做微服务拆分（MVP1 模块化单体即可）
- 不做 GraphQL（RESTful 足够）
- 不做 WebSocket 实时推送（MVP1 用轮询，P1 加 SSE）
- 不做多区域部署
- 不做 Kubernetes（Docker Compose 开发，单节点部署）

---

*本文档为 MVP1 架构冻结版本，变更需通过 ContractChangeRequest。*
