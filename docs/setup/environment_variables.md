# 环境变量说明

> 日期：2026-05-26

---

## 变量清单

| 变量名 | 必须 | 默认值 | 说明 | 敏感 |
|--------|------|--------|------|------|
| `NODE_ENV` | 否 | `development` | 运行环境 | 否 |
| `APP_VERSION` | 否 | `0.1.0` | 应用版本号 | 否 |
| `API_PORT` | 否 | `3001` | API 服务端口 | 否 |
| `DATABASE_URL` | 是 | — | PostgreSQL 连接字符串 | 是 |
| `REDIS_URL` | 是 | — | Redis 连接字符串 | 是 |
| `S3_ENDPOINT` | 是 | — | S3 兼容存储端点 | 否 |
| `S3_ACCESS_KEY` | 是 | — | S3 Access Key | 是 |
| `S3_SECRET_KEY` | 是 | — | S3 Secret Key | 是 |
| `S3_BUCKET_UPLOADS` | 否 | `uploads-raw` | 上传 Bucket | 否 |
| `S3_BUCKET_PROCESSING` | 否 | `processing` | 处理中间产物 Bucket | 否 |
| `S3_BUCKET_PUBLISHED` | 否 | `assets-published` | 发布资产 Bucket | 否 |
| `S3_BUCKET_INTERNAL` | 否 | `system-internal` | 系统内部 Bucket | 否 |
| `S3_REGION` | 否 | `us-east-1` | S3 区域 | 否 |
| `OPENAI_API_KEY` | 是（生产） | — | OpenAI API Key | 是 |
| `OPENAI_BASE_URL` | 否 | `https://api.openai.com/v1` | OpenAI API 端点 | 否 |
| `JWT_SECRET` | 是 | — | JWT 签名密钥 | 是 |
| `JWT_EXPIRY` | 否 | `15m` | Access Token 有效期 | 否 |
| `JWT_REFRESH_EXPIRY` | 否 | `7d` | Refresh Token 有效期 | 否 |
| `FEATURE_VIDEO_LINK_INPUT` | 否 | `false` | 视频链接输入（P1） | 否 |
| `FEATURE_VIDEO_GENERATION` | 否 | `false` | 视频生成（MVP3） | 否 |
| `FEATURE_AUTO_PUBLISH` | 否 | `false` | 自动发布（禁止） | 否 |
| `FEATURE_MOCK_AI` | 否 | `true`(dev)/`false`(prod) | AI Mock 模式 | 否 |
| `NEXT_PUBLIC_API_URL` | 否 | `http://localhost:3001/api/v1` | 前端 API 地址 | 否 |

## 安全规则

1. 所有标记"敏感"的变量不得出现在代码、日志或 Git 历史中
2. 本地开发使用 `.env.local`（已在 .gitignore 中排除）
3. CI 使用 GitHub Secrets
4. 生产使用部署平台的环境变量管理

---

*本文档由 Manus Agent 自动生成。*
