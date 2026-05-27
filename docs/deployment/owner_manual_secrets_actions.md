# Owner 手动 Secrets 配置动作清单

> ⚠️ Manus Agent **不得**读取、复制、导出生产密钥。  
> 以下动作必须由 Owner 或授权 DevOps 人员手动完成。

---

## 一、GitHub Secrets（仓库级）

仓库地址：https://github.com/king1688888/ai-video-growth-engine

**操作路径**：Settings → Secrets and variables → Actions → New repository secret

需要配置的 Secrets：

| Secret 名 | 是否必需 | 用途 |
|-----------|---------|------|
| `STAGING_DEPLOY_TOKEN` | CI 部署需要 | 触发 staging 部署 |
| `PROD_DEPLOY_TOKEN` | 上线后 | 触发生产部署 |
| `CODECOV_TOKEN` | 可选 | 测试覆盖率上报 |

---

## 二、Manus Webdev 项目 Secrets

**操作路径**：进入项目 → Management UI → Settings → Secrets

当前已自动注入（无需手动）：
- `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_KEY`, OAuth 相关

未来需要手动配置（接入真实服务时）：
- `OPENAI_API_KEY`（若不使用 Manus 内置 LLM）
- `SENTRY_DSN`
- 支付平台相关密钥

---

## 三、AI 模型 API Key

| 供应商 | 获取链接 | 安全要求 |
|--------|----------|----------|
| OpenAI | https://platform.openai.com/api-keys | 启用使用上限，分 staging/prod |
| 通义千问 | https://dashscope.console.aliyun.com/ | 同上 |
| Manus 内置 | 自动 | 无需操作 |

---

## 四、对象存储凭证

如果接入真实 S3 / R2 / OSS：

1. 创建独立 IAM 账号，仅授权目标 Bucket 的 GetObject/PutObject
2. 启用 Bucket 加密（SSE-S3 或 SSE-KMS）
3. 设置生命周期策略：原视频 7 天，中间产物 3 天，导出文件 30 天
4. 配置 CORS 仅允许 staging/production 域名
5. 启用访问日志

---

## 五、数据库与 Redis

### 数据库（生产建议）

- 主从复制 + 自动备份
- 启用 SSL/TLS 连接
- VPC 内网访问，禁止公网暴露
- 定期快照（每日 + 保留 7 天）
- 慢查询日志开启

### Redis

- 启用 AUTH 密码
- 仅 VPC 内网
- 持久化策略：AOF（appendonly yes）

---

## 六、支付平台 Webhook Secret

接入支付时：

| 平台 | Webhook 配置 |
|------|--------------|
| 微信支付 | 商户平台 → API 安全 → API v3 密钥 |
| 支付宝 | 应用配置 → 服务器异步通知地址 |

**强制要求**：
- Webhook URL 仅 HTTPS
- 接收端必须验签
- 实现幂等去重（基于 transaction_id + idempotency_key）
- 回放保护（拒绝 5 分钟之外的请求）

---

## 七、日志监控 DSN

| 服务 | 获取方式 |
|------|----------|
| Sentry | https://sentry.io/ → Project Settings → Client Keys |
| Grafana Cloud | https://grafana.com/ → API Keys |
| Slack Webhook | Workspace Settings → Apps → Incoming Webhooks |

---

## 八、DNS / SSL / 回调 URL

| 项 | 当前 | 未来生产 |
|----|------|----------|
| 主域名 | aivideogrow-7hmdkh5f.manus.space | 自定义域名（如 video.example.com） |
| SSL 证书 | Manus 自动 | Cloudflare / Let's Encrypt |
| OAuth 回调 URL | 自动 | 需在 Manus OAuth Portal 注册新域名 |
| 支付回调 URL | - | 接入支付时配置 |

---

## 九、生产审批人

必须明确以下角色的责任人：

| 角色 | 职责 | 当前 |
|------|------|------|
| 项目 Owner | 最终上线决策 | 待确认 |
| 技术负责人 | 代码审批 | 待确认 |
| 合规负责人 | 合规签署 | 待确认 |
| 商业化负责人 | 价格/收费决策 | 待确认 |
| DevOps | 部署执行 | 待确认 |
| 7x24 值班 | 事故响应 | 待确认 |

---

## 十、配置完成确认清单

Owner 完成上述配置后，请勾选：

- [ ] GitHub Secrets 已配置（如 CI 需要）
- [ ] Manus Webdev Secrets 已确认（必要项已就绪）
- [ ] AI 模型 API Key 已配置（生产环境）
- [ ] 对象存储凭证已配置（接入真实 S3 时）
- [ ] Redis / DB 连接已验证
- [ ] 支付 Webhook Secret 已配置（接入支付时）
- [ ] 日志监控 DSN 已配置
- [ ] DNS / SSL 已就绪
- [ ] 生产审批人已确认

---

**完成后，Manus 才能进入阶段 15 的真实 staging 联调。**
