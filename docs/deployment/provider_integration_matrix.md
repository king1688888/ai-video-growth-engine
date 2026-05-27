# 第三方服务接入矩阵

> 更新日期: 2026-05-27

---

## 一、服务接入状态总览

| 类别 | 服务 | 当前状态 | MVP1 必需 | 生产建议 |
|------|------|----------|-----------|----------|
| 数据库 | Webdev 内置 MySQL | ✅ 接入 | 是 | 升级为独立 RDS |
| 缓存 | - | ❌ 未接入 | 否（MVP1 无队列） | Redis 必须 |
| 对象存储 | Webdev 内置 storage | ✅ 接入 | 是 | 独立 R2/S3/OSS |
| AI - LLM | Manus 内置 | ✅ 接入 | 是 | 可继续使用 |
| AI - ASR | - | ❌ 未接入 | 否（MVP1 不处理真实视频音轨） | 通义听悟 / Whisper |
| AI - OCR | - | ❌ 未接入 | 否 | 通义 OCR / 百度 OCR |
| 视频处理 | - | ❌ 未接入 | 否（MVP1 仅描述分析） | FFmpeg Worker |
| 支付 | - | ❌ 未接入（IS_PAYMENT_MOCK） | 否 | 微信支付 + 支付宝 |
| 邮件 | - | ❌ 未接入 | 否 | SendGrid / 阿里云邮件 |
| 短信 | - | ❌ 未接入 | 否 | 阿里云短信 |
| 错误追踪 | - | ❌ 未接入 | 否 | Sentry |
| 指标监控 | - | ❌ 未接入 | 否 | Grafana Cloud |
| 日志聚合 | - | ❌ 未接入 | 否 | LogTail / Datadog |
| 告警 | - | ❌ 未接入 | 否 | Slack Webhook |
| CDN | Manus 自动 | ✅ 接入 | 是 | 可继续 / Cloudflare |
| 域名 / SSL | Manus 自动 | ✅ 接入 | 是 | 自定义域名 + Let's Encrypt |

## 二、Provider Adapter 设计

所有外部服务通过 Adapter 接入，业务代码 **不得** 直接调用 SDK。

```
ProviderRegistry
├── LLMProvider
│   ├── ManusLLMAdapter（默认 ✅）
│   ├── OpenAIAdapter
│   └── DashScopeAdapter
├── ASRProvider
│   ├── MockASRAdapter（仅 dev）
│   ├── DashscopeASRAdapter
│   └── WhisperAdapter
├── OCRProvider
│   ├── MockOCRAdapter（仅 dev）
│   ├── DashscopeOCRAdapter
│   └── PaddleOCRAdapter
├── PaymentProvider
│   ├── MockPaymentAdapter（IS_PAYMENT_MOCK 控制）
│   ├── WechatPayAdapter
│   └── AlipayAdapter
└── StorageProvider
    ├── WebdevStorageAdapter（当前 ✅）
    ├── S3Adapter
    └── R2Adapter
```

## 三、Mock 与真实 Provider 隔离规则

### 强制规则

1. **环境检测**：所有 Mock Adapter 启动时检查 `NODE_ENV`
2. **生产禁用**：`NODE_ENV=production` 时 Mock Adapter 调用必须抛出错误
3. **明示标记**：所有 Mock 返回的数据带 `is_mock: true` 字段
4. **审计落库**：Mock 调用记录到 audit_logs，方便事后排查

### 当前 Mock 状态

| Adapter | 生产隔离 | 检测方式 |
|---------|---------|----------|
| MockProviderAdapter (LLM) | ✅ 已实现 | 环境变量检测 |
| MockASRProvider | ✅ 已实现 | NODE_ENV 检测 |
| MockOCRProvider | ✅ 已实现 | NODE_ENV 检测 |
| IS_PAYMENT_MOCK | ⚠️ 仅常量标记 | 需补充运行时检测 |

## 四、Webhook 幂等与回放测试

支付/通知类 Webhook 必须满足：

| 要求 | 验证方式 |
|------|----------|
| 验签 | 重放含错误签名的请求 → 401 |
| 幂等 | 同一 transaction_id 重放 5 次 → 仅入账 1 次 |
| 时效 | 超过 5 分钟的请求 → 拒绝 |
| 顺序 | 后到达的较新状态覆盖较旧状态 |
| 审计 | 所有 Webhook 调用入 audit_logs |

## 五、日志 trace_id 规则

每次请求必须有：

```
trace_id: <UUID v4> // 全链路追踪
request_id: <UUID v4> // 单次 HTTP 请求
task_id: <int>      // 关联任务（如有）
user_id: <int>      // 操作用户（如有）
```

日志格式（JSON）：

```json
{
  "ts": "2026-05-27T01:23:45.678Z",
  "level": "info",
  "trace_id": "...",
  "request_id": "...",
  "task_id": 123,
  "user_id": 456,
  "module": "task.create",
  "msg": "Task created",
  "is_mock": false
}
```

## 六、当前差距与下一步

| 差距 | 影响 | 解决阶段 |
|------|------|----------|
| 真实 ASR/OCR 未接入 | MVP1 仅能基于文字描述分析 | MVP1.5 |
| 真实支付未接入 | 内测期手动发放积分 | MVP1.5 |
| Sentry 未配置 | 生产错误不可观测 | 阶段 18 部署前 |
| trace_id 未全链路注入 | 排查困难 | 阶段 15 实施 |
| Webhook 幂等未实现 | 接入支付前必须完成 | 接入支付时 |

---
