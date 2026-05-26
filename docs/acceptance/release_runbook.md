# 发布手册（Release Runbook）

> Authority: D20  
> 日期: 2026-05-26

---

## 预发部署步骤

### 1. 合并代码

```bash
# Owner 在 GitHub 上依次 Approve + Merge:
# PR #7 → #8 → #9 → #10 → #11 → #12
# 或合并包含所有内容的最终 PR
```

### 2. 配置基础设施

```bash
# PostgreSQL (Railway/Render)
DATABASE_URL=postgresql://user:pass@host:5432/ai_video_growth

# Redis (Railway/Render)
REDIS_URL=redis://default:pass@host:6379

# Object Storage (Cloudflare R2)
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
```

### 3. 执行数据库迁移

```bash
cd packages/database
npx prisma migrate deploy
```

### 4. 配置 AI 供应商

```bash
OPENAI_API_KEY=sk-xxx  # 真实 key
OPENAI_BASE_URL=https://api.openai.com/v1
FEATURE_MOCK_AI=false  # 关闭 mock
```

### 5. 部署服务

```bash
# Frontend → Vercel (自动部署)
# API → Railway (Docker)
# Worker → Railway (Docker)
```

### 6. Smoke Test

```bash
curl https://api.your-domain.com/api/v1/health
# Expected: { "success": true, "data": { "status": "ok" } }

curl https://api.your-domain.com/api/v1/health/ready
# Expected: all checks "ok"
```

### 7. 配置监控

- Sentry: 错误追踪
- Grafana Cloud: 指标监控
- Uptime Robot: 可用性监控

---

## 监控告警清单

| 指标 | 阈值 | 告警方式 |
|------|------|----------|
| API 响应时间 | > 5s | Slack/Email |
| 错误率 | > 5% | Slack/Email |
| 任务成功率 | < 70% | Slack/Email |
| 队列积压 | > 100 jobs | Slack |
| 积分异常 | 余额为负 | 立即 Slack + Email |
| 模型成本 | 单任务 > $1 | Slack |
| 磁盘使用 | > 80% | Email |

---

*本手册为 MVP1 内测发布指南。正式生产发布需要更严格的流程。*
