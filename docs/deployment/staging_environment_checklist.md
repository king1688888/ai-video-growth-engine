# Staging 环境检查清单

> Authority: D15, D18, D20, D24  
> 更新日期: 2026-05-27

---

## 一、基础设施

| 项目 | 状态 | 说明 |
|------|------|------|
| 数据库（MySQL/TiDB） | ⏳ 待 Owner 配置 | 提供 `DATABASE_URL` |
| Redis（队列/缓存） | ⏳ 待 Owner 配置 | 提供 `REDIS_URL` |
| 对象存储（S3 兼容） | ⏳ 待 Owner 配置 | 4 个 Bucket 或目录前缀 |
| CDN / 静态资源域 | ⏳ 待 Owner 配置 | 视频/封面/导出文件访问 |
| 应用部署平台 | ✅ 已具备（Manus Webdev） | https://aivideogrow-7hmdkh5f.manus.space |
| Manus 内置 LLM | ✅ 已具备 | 通过 `BUILT_IN_FORGE_API_*` 注入 |

## 二、运行时连通性

| 检查项 | 命令 / 验证方法 | 通过标准 |
|--------|----------------|----------|
| DB 连接 | `SELECT 1` | 1ms-100ms 返回 |
| Redis Ping | `redis-cli ping` | `PONG` |
| 对象存储读写 | 上传 1KB 测试文件 + 读取 | 双向成功 |
| 签名 URL | 生成预签名 URL 并 GET | 200 OK |
| AI Provider | 调用 invokeLLM 测试请求 | 返回结构化 JSON |
| 健康检查 | `GET /api/trpc/system.health` | success=true |

## 三、可观测性

| 项目 | 状态 |
|------|------|
| 应用日志（含 trace_id） | ⚠️ 仅 console.log，需接 Sentry/日志服务 |
| 错误追踪（Sentry） | ⏳ 待配置 DSN |
| 指标监控（响应时间/错误率） | ⏳ 待配置 |
| 告警渠道（Slack/邮件） | ⏳ 待配置 |
| 数据库慢查询日志 | ⏳ 待配置 |

## 四、安全与合规

| 项目 | 状态 |
|------|------|
| HTTPS / TLS | ✅ Manus Webdev 自动提供 |
| Cookie HttpOnly + Secure | ✅ 已实现 |
| RBAC（admin/user 角色） | ✅ 已实现 |
| 敏感字段脱敏（admin 视图） | ✅ 已实现（email 部分脱敏） |
| AIGC 标识强制 | ✅ 已实现 |
| 风控阻断导出 | ✅ 已实现 |
| 生产环境 Mock 禁用 | ⏳ 需 `FEATURE_MOCK_AI=false` |
| Secrets 不入 Git | ✅ `.env.example` 已脱敏 |

## 五、回滚能力

| 项目 | 状态 |
|------|------|
| 应用代码回滚 | ✅ Manus Webdev 内置版本管理 |
| 数据库 Schema 回滚 | ✅ Drizzle migration 文件保留 |
| 数据备份策略 | ⏳ 待 Owner 配置 |
| 灰度开关（Feature Flag） | ⚠️ 部分实现，需扩展 |

## 六、进入 staging 的最小门槛

- DB / Redis / S3 / AI Provider 真实连通
- 至少一次 staging smoke test 通过
- 监控告警接通（即便只有日志）
- 回滚脚本可执行

## 七、当前 Staging 状态

**当前已部署到 Manus Webdev：** https://aivideogrow-7hmdkh5f.manus.space

| 维度 | 状态 |
|------|------|
| 应用可访问 | ✅ |
| 数据库（Webdev 内置 MySQL） | ✅ |
| OAuth 登录（Manus Portal） | ✅ |
| AI 调用（Manus 内置 LLM） | ✅ |
| 真实 S3 对象存储 | ⚠️ 当前使用 Webdev 内置 storage |
| 监控告警 | ❌ 未配置 |
| Sentry | ❌ 未配置 |

**结论：可作为 Internal Test 用，不可作为 Staging Ready 进入灰度收费。**

---
