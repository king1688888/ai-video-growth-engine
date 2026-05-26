# P0/P1 差距登记簿

> 审计日期: 2026-05-26  
> 基于: phase_0_10_evidence_audit.md

---

## P0 差距（阻塞任何形式的上线）

| ID | 差距 | 原因 | 影响 | 修复方式 | 阻塞阶段 |
|----|------|------|------|----------|----------|
| P0-01 | PR #7-#14 未合并到 main | Owner 未 Approve | main 无工程代码 | Owner 合并 | 13 |
| P0-02 | pnpm install 未执行 | 无 node_modules | 应用无法启动 | 合并后执行 | 13 |
| P0-03 | Prisma migrate 未执行 | 无 DB 连接 | 无数据持久化 | 配置 DB + migrate | 13 |
| P0-04 | API 业务逻辑全部 TODO | placeholder 返回假数据 | 无真实功能 | 逐步实现 | 13-15 |
| P0-05 | JWT 认证未实现 | 仅有 controller 骨架 | 无鉴权保护 | 实现 auth module | 13 |
| P0-06 | BullMQ 未连接 Redis | 仅有 service 定义 | 任务无法异步执行 | 配置 Redis + 连接 | 13 |
| P0-07 | 真实模型调用未配置 | 无 API Key | AI 链路不可用 | 配置 Key + 关闭 Mock | 14 |
| P0-08 | 前端未安装依赖 | 无 node_modules | 页面无法访问 | pnpm install | 13 |
| P0-09 | 无监控告警 | 未配置 Sentry/Grafana | 生产不可观测 | 部署时配置 | 14 |
| P0-10 | 无 staging 环境 | 未部署 | 无法预发验证 | 部署到 Railway | 14 |
| P0-11 | E2E 未在真实环境执行 | 仅有规范定义 | 主流程未端到端验证 | 联调后执行 Playwright | 16 |
| P0-12 | CI 未检查代码 | 仅检查文档 | 代码质量无自动保障 | 更新 workflow | 13 |

## P1 差距（影响内测质量，应在灰度前解决）

| ID | 差距 | 原因 | 影响 | 修复方式 |
|----|------|------|------|----------|
| P1-01 | 真实 ASR Provider 未接入 | 无 API Key | 视频处理用 Mock | 配置阿里云/Whisper |
| P1-02 | 真实 OCR Provider 未接入 | 无 API Key | OCR 用 Mock | 配置阿里云 OCR |
| P1-03 | 相似度检测为模式匹配 | 未实现语义相似度 | 精度有限 | 后续升级 |
| P1-04 | 支付未接入 | IS_PAYMENT_MOCK=true | 无法真实收费 | MVP1.5 接入 |
| P1-05 | 用户协议/隐私政策未起草 | 需法务确认 | 合规风险 | Agent 草稿 + Owner 确认 |
| P1-06 | 前端 Tailwind/shadcn 未配置 | 仅原生 HTML | UI 粗糙 | 安装配置 |
| P1-07 | 任务进度轮询未实现 | 前端 TODO | 用户看不到实时进度 | 实现 setInterval |
| P1-08 | 路由守卫未实现 | 前端 TODO | 未登录可访问 | 实现 middleware |
| P1-09 | 积分幂等仅内存验证 | 未与 DB 事务绑定 | 生产可能不幂等 | Prisma 事务实现 |
| P1-10 | 投诉删除 S3 物理删除未实现 | 仅标记 flag | 资产可能残留 | 实现 Worker |

---

## 汇总

| 等级 | 数量 | 说明 |
|------|------|------|
| P0 | 12 | 阻塞任何上线 |
| P1 | 10 | 影响内测质量 |

---

## 修复路径

```text
Phase 13: P0-01 → P0-02 → P0-03 → P0-05 → P0-06 → P0-08 → P0-12
Phase 14: P0-07 → P0-09 → P0-10
Phase 15: P0-04 (AI 链路部分)
Phase 16: P0-11 (E2E)
```

---

*本登记簿将随修复进展持续更新。每个 P0 关闭需绑定 commit + 测试证据。*
