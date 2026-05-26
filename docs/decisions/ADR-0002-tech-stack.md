# ADR-0002: MVP1 技术栈选型

> 状态：已接受  
> 日期：2026-05-26  
> 决策者：项目 Owner + Manus Agent (CTO Role)  
> 权威文档：D15

---

## 背景

MVP1 需要支持：视频上传/处理、多模态 AI 理解、异步任务编排、积分计费、风控质检、报告导出、运营后台。需要在开发效率、运维成本、扩展性之间取得平衡。

## 决策

| 层级 | 选型 | 否决方案 | 否决理由 |
|------|------|----------|----------|
| 前端 | Next.js + TypeScript + Tailwind + shadcn/ui | Nuxt/SvelteKit | React 生态最成熟，AIcoding 支持最好 |
| 后端 | NestJS + TypeScript | Express / Fastify 裸框架 | NestJS 模块化、DI、Guard、BullMQ 集成成熟 |
| 后端 | NestJS（非 Next.js API Route） | Next.js API Route | 项目复杂度高（队列/RBAC/审计），需要独立后端 |
| ORM | Prisma | Drizzle / TypeORM | Prisma 类型安全最强、迁移管理最友好、AIcoding 生态最好 |
| 数据库 | PostgreSQL | MySQL/TiDB | JSONB 原生支持、pgvector 预留、生态成熟 |
| 队列 | BullMQ + Redis | Temporal | MVP1 不需要 Temporal 的复杂度；BullMQ 轻量、Redis 复用、NestJS 原生集成 |
| 视频 Worker | Python + FFmpeg | Node + FFmpeg | Python 视频/AI 生态更成熟（PyAV/OpenCV/Whisper） |
| 对象存储 | Cloudflare R2 | AWS S3 / 阿里 OSS | 零出流量费、S3 兼容、全球 CDN |
| 部署 | Vercel + Railway | 自建 K8s | MVP1 不需要 K8s 复杂度，PaaS 快速上线 |
| CI | GitHub Actions | Jenkins / GitLab CI | 已在 GitHub，零额外配置 |
| 测试 | Vitest + Playwright | Jest | Vitest 更快、ESM 原生支持 |

## 关于 Temporal 的决策

**不采用 Temporal**，理由：

1. MVP1 的 DAG 复杂度可用 BullMQ + Orchestrator Worker 覆盖
2. Temporal 需要额外基础设施（Temporal Server + DB）
3. 团队（AI Agent）对 BullMQ 更熟悉
4. 后续如果 MVP2+ 需要更复杂编排，可迁移到 Temporal（架构已预留）

## 关于 NestJS vs Next.js API Route 的决策

**采用独立 NestJS 后端**，理由：

1. 项目有 15+ 模块、复杂 RBAC、审计日志、队列编排
2. NestJS 的模块化、DI、Guard/Interceptor 更适合企业级后端
3. 后端可独立扩缩，不受前端部署影响
4. Worker 可复用 NestJS 模块（Billing、Risk 等）

## 影响

| 影响 | 说明 |
|------|------|
| Monorepo 结构 | pnpm workspace 管理 web/api/workers/shared |
| 语言 | TypeScript（主）+ Python（视频/AI Worker） |
| 部署复杂度 | 3 个独立服务（前端/API/Worker）+ 2 个托管服务（DB/Redis） |
| 开发环境 | Docker Compose 一键启动 |
| 迁移路径 | Docker 化确保可迁移到任何云 |

---

*本 ADR 为 MVP1 架构冻结版本。变更需通过新 ADR。*
