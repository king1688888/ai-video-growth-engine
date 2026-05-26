# 安全与权限计划

> 权威文档：D18  
> 日期：2026-05-26

---

## RBAC 角色

| 角色 | 权限 | 说明 |
|------|------|------|
| `user` | 自有资源 CRUD、任务创建、报告查看、导出 | 普通用户 |
| `admin` | 全局只读 + 补偿 + 复核 + 投诉处理 | 运营管理员 |
| `super_admin` | 全部权限 + 配置管理 + 用户管理 | 超级管理员 |
| `service` | Worker 内部调用权限 | 系统服务账号 |

## 数据隔离

- 用户只能访问 `organization_id` 匹配的数据
- API 层统一注入 `org_id` 过滤
- Worker 使用 `service` 角色，但操作记录 `trace_id`
- 后台查询需要 `admin` 角色 + 审计日志

## 认证方案

| 项 | 方案 |
|----|------|
| 用户认证 | Email + Password（bcrypt hash） |
| Token | JWT Access Token（15min）+ Refresh Token（7d） |
| API 鉴权 | Bearer Token + NestJS AuthGuard |
| Worker 鉴权 | 内部 Service Token（环境变量） |
| 后台鉴权 | JWT + RBAC Guard |

## 密钥管理

| 密钥类型 | 存储方式 |
|----------|----------|
| DB 密码 | 环境变量 / Secret Manager |
| Redis 密码 | 环境变量 |
| S3 凭证 | 环境变量 |
| AI API Key | 环境变量（按供应商分离） |
| JWT Secret | 环境变量 |

**禁止**：硬编码任何密钥到代码、配置文件或日志中。

## 审计日志

所有以下操作必须记录 `audit_logs`：
- 用户注册/登录/密码变更
- 后台操作（补偿、复核、删除、配置变更）
- 积分变动（冻结、扣费、返还、补偿）
- 资产删除（用户删除、投诉删除）
- 权限变更

---

*本文档为 MVP1 架构冻结版本。安全细节以 D18 为权威。*
