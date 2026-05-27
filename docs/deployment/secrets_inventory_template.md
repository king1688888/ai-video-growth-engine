# Secrets 清单模板

> ⚠️ 本文档为模板，**严禁** 提交任何真实密钥值到 Git。  
> 所有 Secret 值由 Owner 在部署平台/GitHub Secrets/Manus Project Settings 中配置。

---

## 一、Secrets 完整列表

### 数据库

| 变量名 | 用途 | Staging | Production | 责任人 |
|--------|------|---------|------------|--------|
| `DATABASE_URL` | MySQL/TiDB 连接串 | `<staging>` | `<prod>` | DevOps |

### 缓存与队列

| 变量名 | 用途 | Staging | Production | 责任人 |
|--------|------|---------|------------|--------|
| `REDIS_URL` | Redis 连接串 | `<staging>` | `<prod>` | DevOps |

### 对象存储（S3 兼容）

| 变量名 | 用途 | Staging | Production |
|--------|------|---------|------------|
| `S3_ENDPOINT` | S3 端点 | `<staging>` | `<prod>` |
| `S3_ACCESS_KEY` | Access Key | `<staging>` | `<prod>` |
| `S3_SECRET_KEY` | Secret Key | `<staging>` | `<prod>` |
| `S3_BUCKET_UPLOADS` | 上传 Bucket | `staging-uploads` | `prod-uploads` |
| `S3_BUCKET_PROCESSING` | 中间产物 | `staging-processing` | `prod-processing` |
| `S3_BUCKET_PUBLISHED` | 发布资产 | `staging-published` | `prod-published` |
| `S3_BUCKET_INTERNAL` | 系统内部 | `staging-internal` | `prod-internal` |
| `S3_REGION` | 区域 | `<staging>` | `<prod>` |

### AI 模型供应商

| 变量名 | 用途 | Staging | Production | 备注 |
|--------|------|---------|------------|------|
| `OPENAI_API_KEY` | OpenAI/兼容服务 | `<sandbox>` | `<prod>` | 沙箱/正式环境隔离 |
| `OPENAI_BASE_URL` | API 端点 | `<staging>` | `<prod>` | 可指向兼容代理 |
| `ALIYUN_DASHSCOPE_API_KEY` | 通义千问（备选） | `<sandbox>` | `<prod>` | 可选 |
| `BUILT_IN_FORGE_API_KEY` | Manus 内置 LLM | 自动注入 | 自动注入 | 平台管理 |

### 认证与会话

| 变量名 | 用途 | Staging | Production |
|--------|------|---------|------------|
| `JWT_SECRET` | 会话签名密钥 | `<unique-staging>` | `<unique-prod>` |
| `VITE_APP_ID` | Manus OAuth App ID | 自动注入 | 自动注入 |
| `OAUTH_SERVER_URL` | OAuth 服务端 | 自动注入 | 自动注入 |
| `VITE_OAUTH_PORTAL_URL` | OAuth Portal | 自动注入 | 自动注入 |

### 支付（MVP1.5 接入）

| 变量名 | 用途 | Staging | Production | 状态 |
|--------|------|---------|------------|------|
| `WECHAT_PAY_MCHID` | 微信支付商户号 | 沙箱 | 正式 | ⏳ 待接入 |
| `WECHAT_PAY_APIV3_KEY` | APIv3 密钥 | 沙箱 | 正式 | ⏳ 待接入 |
| `WECHAT_PAY_WEBHOOK_SECRET` | Webhook 签名验证 | 沙箱 | 正式 | ⏳ 待接入 |
| `ALIPAY_APP_ID` | 支付宝 App ID | 沙箱 | 正式 | ⏳ 待接入 |
| `ALIPAY_PRIVATE_KEY` | 应用私钥 | 沙箱 | 正式 | ⏳ 待接入 |
| `ALIPAY_PUBLIC_KEY` | 支付宝公钥 | 沙箱 | 正式 | ⏳ 待接入 |

### 监控与告警

| 变量名 | 用途 | Staging | Production |
|--------|------|---------|------------|
| `SENTRY_DSN` | 错误追踪 | `<staging>` | `<prod>` |
| `GRAFANA_API_KEY` | 指标推送 | `<staging>` | `<prod>` |
| `SLACK_WEBHOOK_URL` | 告警通知 | `<staging>` | `<prod>` |

### Feature Flags（非敏感，但需明示）

| 变量名 | Staging | Production | 备注 |
|--------|---------|------------|------|
| `FEATURE_MOCK_AI` | `false` | **必须 false** | 生产严禁 mock |
| `FEATURE_MOCK_PAYMENT` | `true` | **必须 false** | 生产严禁 mock |
| `FEATURE_VIDEO_LINK_INPUT` | `false` | `false` | MVP1.5 P1 |
| `FEATURE_VIDEO_GENERATION` | `false` | `false` | MVP3 |
| `FEATURE_AUTO_PUBLISH` | `false` | **必须 false** | 永久禁止 |

---

## 二、Secrets 安全规则

1. **绝不入 Git**：所有标记 `<>` 的值通过部署平台 Secret 管理
2. **环境隔离**：staging 与 production 必须使用不同的密钥
3. **最小权限**：每个 Secret 仅授予对应服务最小必要权限
4. **轮换计划**：JWT / 数据库密码 至少每 90 天轮换一次
5. **审计访问**：生产 Secret 修改需要 2 人审批 + 审计日志
6. **泄露应急**：见 `incident_review_template.md`

---

## 三、当前已知差异

| Secret | 当前状态（Webdev 部署） |
|--------|-------------------------|
| `DATABASE_URL` | ✅ Webdev 内置 MySQL |
| `JWT_SECRET` | ✅ Webdev 自动注入 |
| OAuth 相关 | ✅ Webdev 自动注入 |
| `BUILT_IN_FORGE_API_KEY` | ✅ Manus 内置 |
| `S3_*` | ⚠️ 当前使用 Webdev storage，未来真实业务需独立 S3 |
| 监控类 | ❌ 未配置 |
| 支付类 | ❌ 未接入（MVP1.5） |

---
